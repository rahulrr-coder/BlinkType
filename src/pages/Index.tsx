
import TypingGame from '../components/TypingGame';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cream-50 via-white to-cream-100 dark:from-navy-900 dark:via-navy-800 dark:to-navy-900 transition-all duration-500">
      {/* Add padding-top to make room for fixed header */}
      <div className="pt-16 flex-1">
        <TypingGame />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
