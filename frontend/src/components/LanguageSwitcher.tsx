import { Button } from '@/components/ui/button';
import { useLanguage } from '@/content/LanguageContext';
import { cn } from '@/lib/utils';

const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  return (
    <div className="flex gap-1 bg-blue-200 backdrop-blur-md rounded-lg p-0.5 border-2 border-blue-300 shadow-lg ring-2 ring-blue-200/50">
      <Button
        variant={currentLanguage === 'en' ? 'secondary' : 'default'}
        size="sm"
        onClick={() => setLanguage('en')}
        className={cn(
          "transition-all duration-200 font-semibold px-2 sm:px-3",
          currentLanguage === 'en' 
            ? "bg-primary text-blue-900 shadow-md hover:bg-primary/90 hover:shadow-lg" 
            : "bg-white text-black hover:bg-gray-100 hover:text-gray-900 border border-gray-300 font-bold"
        )}
      >
        <span className="mr-1 text-sm sm:text-base">🇬🇧</span>
        <span className="hidden sm:inline text-xs sm:text-sm">English</span>
        <span className="sm:hidden text-xs">EN</span>
      </Button>
      <Button
        variant={currentLanguage === 'am' ? 'secondary' : 'default'}
        size="sm"
        onClick={() => setLanguage('am')}
        className={cn(
          "transition-all duration-200 font-semibold px-2 sm:px-3",
          currentLanguage === 'am' 
            ? "bg-primary text-black shadow-md hover:bg-primary/90 hover:shadow-lg" 
            : "bg-white text-black hover:bg-gray-100 hover:text-gray-900 border border-gray-300 font-bold"
        )}
      >
        <span className="mr-1 text-sm sm:text-base">🇪🇹</span>
        <span className="hidden sm:inline text-xs sm:text-sm">አማርኛ</span>
        <span className="sm:hidden text-xs">AM</span>
      </Button>
    </div>
  );
};

export default LanguageSwitcher;