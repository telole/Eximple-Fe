import { useEffect } from 'react';
import useProgressStore from '../../stores/progressStore';
import Navbar from '../common/Navbar';

function Teams() {
  const { stats, getStats } = useProgressStore();

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-[#020c02] to-[#041d05] relative overflow-x-hidden overflow-y-auto">
      <Navbar stats={stats} activePage="teams" />
      
      <div className="w-full">
        <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 pb-12 sm:pb-16 md:pb-20">
          <div className="flex justify-center mb-6 sm:mb-8">
            <span className="font-['ZT_Nature'] text-xl sm:text-2xl md:text-3xl font-medium bg-gradient-to-r from-[rgba(170,170,170,0.8)] to-[#eeeeee] bg-clip-text text-transparent text-center max-w-2xl px-4">
              Meet the team behind Eximple
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-8 sm:gap-12 md:gap-16 lg:gap-20 px-4 md:px-12 lg:px-20">
            {/* BRAMASTA */}
            <div className="w-full max-w-[300px] h-[400px] sm:h-[450px] md:h-[480px] shrink-0 relative mx-auto">
              <img src="/img/codia/team-member-2.svg" alt="Team member" className="w-full h-full absolute top-0 left-0 object-contain" />
              <div className="w-[120px] sm:w-[140px] md:w-[154.335px] h-[150px] sm:h-[170px] md:h-[188.918px] bg-cover bg-center bg-no-repeat absolute top-[120px] sm:top-[140px] md:top-[155.128px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(/img/codia/team-member-3.svg)'
              }}></div>
              <span className="absolute top-[190px] sm:top-[215px] md:top-[240px] left-1/2 -translate-x-1/2 font-['ZT_Nature'] text-lg sm:text-xl md:text-[24px] font-medium leading-[27.6px] text-[rgba(170,170,170,0.5)] text-center whitespace-nowrap">
                RESEARCHER
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-['Airlash_Raiders'] text-lg sm:text-xl md:text-[24px] font-normal leading-[27.6px] text-[#eeeeee] text-center whitespace-nowrap">
                Bramasta
              </span>
            </div>

            {/* MADINA - RESEARCHER */}
            <div className="w-full max-w-[300px] h-[400px] sm:h-[450px] md:h-[480px] shrink-0 relative mx-auto">
              <img src="/img/codia/team-member-2.svg" alt="Team member" className="w-full h-full absolute top-0 left-0 object-contain" />
              <div className="w-[120px] sm:w-[140px] md:w-[154.335px] h-[150px] sm:h-[170px] md:h-[188.918px] bg-cover bg-center bg-no-repeat absolute top-[120px] sm:top-[140px] md:top-[155.128px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(/img/codia/team-member-3.svg)'
              }}></div>
              <span className="absolute top-[190px] sm:top-[215px] md:top-[240px] left-1/2 -translate-x-1/2 font-['ZT_Nature'] text-lg sm:text-xl md:text-[24px] font-medium leading-[27.6px] text-[rgba(170,170,170,0.5)] text-center whitespace-nowrap">
                RESEARCHER
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-['Airlash_Raiders'] text-lg sm:text-xl md:text-[24px] font-normal leading-[27.6px] text-[#eeeeee] text-center whitespace-nowrap">
                MADINA
              </span>
            </div>

            {/* NARAYA - PROGRAMMER */}
            <div className="w-full max-w-[300px] h-[400px] sm:h-[450px] md:h-[480px] shrink-0 relative mx-auto">
              <img src="/img/codia/team-member-4.svg" alt="Team member" className="w-full h-full absolute top-0 left-0 object-contain" />
              <div className="w-[125px] sm:w-[145px] md:w-[160.505px] h-[87px] sm:h-[100px] md:h-[111.908px] bg-cover bg-center bg-no-repeat absolute top-[150px] sm:top-[170px] md:top-[193px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(/img/codia/team-member-5.png)'
              }}></div>
              <div className="w-[52px] sm:w-[60px] md:w-[67.359px] h-[67px] sm:h-[77px] md:h-[86.176px] bg-cover bg-center bg-no-repeat absolute top-[185px] sm:top-[210px] md:top-[235.698px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(/img/codia/team-member-6.png)'
              }}></div>
              <span className="absolute top-[190px] sm:top-[215px] md:top-[240px] left-1/2 -translate-x-1/2 font-['ZT_Nature'] text-lg sm:text-xl md:text-[24px] font-medium leading-[27.6px] text-[rgba(170,170,170,0.5)] text-center whitespace-nowrap">
                PROGRAMMER
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-['Airlash_Raiders'] text-lg sm:text-xl md:text-[24px] font-normal leading-[27.6px] text-[#eeeeee] text-center whitespace-nowrap">
                NARAYA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teams;
