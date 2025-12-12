function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-8 md:px-16 lg:px-20 border-t border-[#1fb622]/20">
      <div className="flex flex-col gap-6">
        {/* Description Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <h4 className="font-['ZT_Nature'] text-lg font-medium text-white mb-2">About Eximple</h4>
            <p className="font-['ZT_Nature'] text-sm text-[#aaaaaa] leading-relaxed">
              Eximple is an innovative learning platform designed to make education engaging and interactive. 
              Master subjects through gamified lessons and track your progress.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-['ZT_Nature'] text-lg font-medium text-white mb-2">Learning Journey</h4>
            <p className="font-['ZT_Nature'] text-sm text-[#aaaaaa] leading-relaxed">
              Complete levels, earn rewards, and unlock achievements as you progress through your educational journey. 
              Each level brings new challenges and knowledge.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-['ZT_Nature'] text-lg font-medium text-white mb-2">Get Started</h4>
            <p className="font-['ZT_Nature'] text-sm text-[#aaaaaa] leading-relaxed">
              Start your learning adventure today. Choose your subject, complete lessons, and watch your skills grow. 
              Join thousands of learners already on their journey.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-[#1fb622]/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-09/527xmx2x1v.png)'}}
              ></div>
            </div>
            <span className="font-['Airlash_Raiders'] text-xl font-normal bg-gradient-to-b from-[#1fb622] to-[#168318] bg-clip-text text-transparent">Eximple</span>
          </div>
          <p className="font-['ZT_Nature'] text-sm font-medium text-[#aaaaaa]">
            ┬⌐ {currentYear} Eximple. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

