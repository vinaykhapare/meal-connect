// import React from 'react'
import Marqueeanimation from "../components/utils/Marqueeanimation"
import Textdonation from "../components/donation/Textdonation";
import FaqSection from '../components/faq/FaqSection';
import AboutStats from '../components/about/AboutStats';

function Aboutpage() {
  return (
    <div>
      <Textdonation />
      <AboutStats />
      <div>
        <Marqueeanimation />
      </div>
      <FaqSection />
    </div>
  );
}

export default Aboutpage;
