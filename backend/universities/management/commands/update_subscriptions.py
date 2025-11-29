from django.core.management.base import BaseCommand
from payments.models import Payment
from universities.models import UserDashboard
from django.utils import timezone
from datetime import timedelta


class Command(BaseCommand):
    help = 'Manually update subscriptions for users with successful payments'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            help='Email of specific user to update',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Update all users with unprocessed payments',
        )

    def handle(self, *args, **options):
        self.stdout.write('=== SUBSCRIPTION UPDATE COMMAND ===\n')

        if options['email']:
            # Update specific user
            from django.contrib.auth.models import User
            try:
                user = User.objects.get(email=options['email'])
                self.update_user_subscription(user)
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'User with email {options["email"]} not found'))
        elif options['all']:
            # Update all users with unprocessed payments
            unprocessed_payments = Payment.objects.filter(
                status='success',
                subscription_updated=False
            )
            self.stdout.write(f'Found {unprocessed_payments.count()} unprocessed payments\n')

            for payment in unprocessed_payments:
                self.update_user_subscription(payment.user, payment)
        else:
            # Show recent payments status
            recent_payments = Payment.objects.all().order_by('-payment_date')[:10]
            self.stdout.write(f'\n=== RECENT {recent_payments.count()} PAYMENTS ===\n')

            for p in recent_payments:
                self.stdout.write(f'\nPayment ID: {p.id}')
                self.stdout.write(f'  TX Ref: {p.tx_ref}')
                self.stdout.write(f'  User: {p.user.email}')
                self.stdout.write(f'  Amount: {p.amount} ETB')
                self.stdout.write(f'  Status: {p.status}')
                self.stdout.write(f'  Subscription Updated: {p.subscription_updated}')
                self.stdout.write(f'  Date: {p.payment_date}')

                try:
                    dashboard = UserDashboard.objects.get(user=p.user)
                    self.stdout.write(f'  Dashboard Status: {dashboard.subscription_status}')
                    self.stdout.write(f'  Dashboard End Date: {dashboard.subscription_end_date}')
                    self.stdout.write(f'  Dashboard Verified: {dashboard.is_verified}')
                except UserDashboard.DoesNotExist:
                    self.stdout.write(self.style.WARNING('  Dashboard: NOT FOUND'))

            self.stdout.write(f'\n\nUse --email <email> to update specific user')
            self.stdout.write(f'Use --all to process all unprocessed payments')

    def update_user_subscription(self, user, payment=None):
        self.stdout.write(f'\n=== Updating subscription for {user.email} ===')

        # Get or create dashboard
        dashboard, created = UserDashboard.objects.get_or_create(user=user)
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created new dashboard for {user.email}'))

        # Find payment if not provided
        if not payment:
            payment = Payment.objects.filter(
                user=user,
                status='success'
            ).order_by('-payment_date').first()

        if not payment:
            self.stdout.write(self.style.ERROR(f'No successful payment found for {user.email}'))
            return

        self.stdout.write(f'Using payment: {payment.tx_ref} ({payment.amount} ETB)')
        self.stdout.write(f'Before update:')
        self.stdout.write(f'  subscription_status: {dashboard.subscription_status}')
        self.stdout.write(f'  subscription_end_date: {dashboard.subscription_end_date}')
        self.stdout.write(f'  is_verified: {dashboard.is_verified}')
        self.stdout.write(f'  subscription_updated: {payment.subscription_updated}')

        try:
            # Update subscription
            from decimal import Decimal
            months_added = dashboard.update_subscription(
                Decimal(str(payment.amount)),
                monthly_price=Decimal('500')
            )

            # Mark payment as processed
            payment.subscription_updated = True
            payment.save()

            # Refresh dashboard
            dashboard.refresh_from_db()

            self.stdout.write(self.style.SUCCESS(f'\nSuccessfully updated subscription!'))
            self.stdout.write(f'After update:')
            self.stdout.write(f'  subscription_status: {dashboard.subscription_status}')
            self.stdout.write(f'  subscription_end_date: {dashboard.subscription_end_date}')
            self.stdout.write(f'  is_verified: {dashboard.is_verified}')
            self.stdout.write(f'  months_added: {months_added}')
            self.stdout.write(f'  subscription_updated: {payment.subscription_updated}')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error updating subscription: {e}'))
            import traceback
            self.stdout.write(traceback.format_exc())
