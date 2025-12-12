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
        <div className="relative px-8 md:px-16 lg:px-20 pb-20">
          <div className="flex justify-center mb-8">
            <span className="font-['ZT_Nature'] text-2xl md:text-3xl font-medium bg-gradient-to-r from-[rgba(170,170,170,0.8)] to-[#eeeeee] bg-clip-text text-transparent text-center max-w-2xl">
              Meet the team behind Eximple
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-center items-start gap-16 md:gap-16 lg:gap-20 px-4 md:px-12 lg:px-20">
            {/* BRAMASTA */}
            <div className="w-[300px] h-[480px] shrink-0 relative mx-auto">
              <div className="w-[300px] h-[480px] bg-cover bg-center bg-no-repeat absolute top-0 left-0" style={{
                backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/EKEMLU586H.png)'
              }}></div>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-['Airlash_Raiders'] text-[24px] font-normal leading-[27.6px] text-[#eeeeee] text-center whitespace-nowrap">
                BRAMASTA
              </span>
            </div>

            {/* MADINA - RESEARCHER */}
            <div className="w-[300px] h-[480px] shrink-0 relative mx-auto">
              <div className="w-[300px] h-[480px] bg-cover bg-center bg-no-repeat absolute top-0 left-0" style={{
                backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/eHc3Goveag.png)'
              }}></div>
              <div className="w-[154.335px] h-[188.918px] bg-cover bg-center bg-no-repeat absolute top-[155.128px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/5hiWmaTpxo.png)'
              }}></div>
              <span className="absolute top-[240px] left-1/2 -translate-x-1/2 font-['ZT_Nature'] text-[24px] font-medium leading-[27.6px] text-[rgba(170,170,170,0.5)] text-center whitespace-nowrap">
                RESEARCHER
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-['Airlash_Raiders'] text-[24px] font-normal leading-[27.6px] text-[#eeeeee] text-center whitespace-nowrap">
                MADINA
              </span>
            </div>

            {/* NARAYA - PROGRAMMER */}
            <div className="w-[300px] h-[480px] shrink-0 relative mx-auto">
              <div className="w-[300px] h-[480px] bg-cover bg-center bg-no-repeat absolute top-0 left-0" style={{
                backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/R6A5ZDCpS6.png)'
              }}></div>
              <div className="w-[160.505px] h-[111.908px] bg-cover bg-center bg-no-repeat absolute top-[193px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/qDvstwS9ak.png)'
              }}></div>
              <div className="w-[67.359px] h-[86.176px] bg-cover bg-center bg-no-repeat absolute top-[235.698px] left-1/2 -translate-x-1/2" style={{
                backgroundImage: 'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-12/fmtZY3Oejs.png)'
              }}></div>
              <span className="absolute top-[240px] left-1/2 -translate-x-1/2 font-['ZT_Nature'] text-[24px] font-medium leading-[27.6px] text-[rgba(170,170,170,0.5)] text-center whitespace-nowrap">
                PROGRAMMER
              </span>
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-['Airlash_Raiders'] text-[24px] font-normal leading-[27.6px] text-[#eeeeee] text-center whitespace-nowrap">
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
