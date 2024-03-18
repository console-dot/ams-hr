import React from 'react';
import { MyPDFDocument } from './MyPDFDocument ';
import { useNavigate } from 'react-router-dom';


const PrintButton = ({empData}) => {
    const navigate =useNavigate();
  const handlePrint = () => {
    window.print();
  
  };

  return (
    <div className='flex w-full justify-end'>
      <button className="nonPrintable btn bg-[#186080] text-slate-100 hover:text-[#186080] " onClick={handlePrint}>Print</button>
      <MyPDFDocument empData={empData}/>
    </div>
  );
};

export default PrintButton;
