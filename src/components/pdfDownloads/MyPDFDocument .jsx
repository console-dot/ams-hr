import { Document, Page, Text } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { getSingleDesignation } from '../../api';
import { Table } from './Table';
import { AbsTable } from './AbsTable';
import { HalfDayTable } from './HalfDayTable';
import { PublicHolidayTable } from './PublicHolidayTable';
import { convertDate } from '../attendanceTable';
import { PresentTable } from './PresentTable';

export const MyPDFDocument = ({ empData }) => {
  const [desi, setDesi] = useState();
  // let length= empData?.attendance?.length
  // const[startDate, setStartDate]=useState(empData && convertDate(empData?.attendance[0]?.checkin, 'monthAndDay'));
  // const[endDate, setEndDate]=useState(empData && convertDate(empData?.attendance[length-1]?.checkin, 'monthAndDay'));

  const designation = async (id) => {
    try {
      const res = await getSingleDesignation(id);
      if (res.status === 200) {
        setDesi(res?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    designation(empData?.user?.designation);
  }, [empData]);
  let fullDay = empData?.attendance?.filter((i) => i.status === 'full');

  return (
    <div className='printable'>
      <div className='p-2'>
        <div className='flex w-full'>
          <div className='flex flex-col gap-2' style={{ width: "80%" }}>
            <div className='flex items-center gap-12'>
              <h2 className='text-lg font-bold ' style={{ width: "108px" }}>Name : </h2>
              <h2>{empData?.user?.name}</h2>
            </div>
            <div className='flex items-start gap-12'>
              <h2 className='text-lg font-bold w-48' style={{ width: "108px" }}>Employe ID :</h2>
              <h2>{empData?.user?.employeeId}</h2>
            </div>
            <div className='flex items-center gap-12'>
              <h2 className='text-md font-bold w-48' style={{ width: "108px" }}>Designation :</h2>
              <h2>{desi?.title}</h2>
            </div>
            <div className='flex items-center gap-12'>
              <h2 className='text-lg font-bold w-48' style={{ width: "108px" }}>Phone No :</h2>
              <h2>{empData?.user?.phone}</h2>
            </div>
            <div className='flex items-center gap-12'>
              <h2 className='text-lg font-bold w-48' style={{ width: "108px" }}>Email :</h2>
              <h2>{empData?.user?.email}</h2>
            </div>
            {/* <div className='flex items-center gap-12'F>
                <h2 className='text-lg font-bold w-48' style={{width:"112px"}}>Report Duration :</h2>
                <h2>{` ${startDate} -- ${endDate}`}</h2>
              </div> */}

          </div>
          <div className='flex justify-center'> <img src="/logo.jpg" alt="" width={200} height={100} style={{ width: "150px", height: "150px" }} /> </div>
        </div>
        <div className='flex flex-col gap-12 mt-12'>
          <AbsTable heading={"Absents"} header={['Date', 'Status']} data={empData?.abDates} />
          <Table heading={'Leaves'} header={['Date', 'Status']} data={empData?.leaves} />
          <HalfDayTable heading={"Half Days"} header={['Date', 'Login Time', 'LogoutTime', 'Status']} data={empData} />
          <PresentTable heading={"Presents"} header={['Date', 'Login Time', 'Logout Time', 'Status']} data={empData?.attendance} />
          <PresentTable heading={"Full Day"} header={['Date', 'Login Time', 'Logout Time', 'Status']} data={fullDay} />




          <PublicHolidayTable heading={"Public Holidays"} header={['Date', 'Reason']} data={empData?.publicHolidays} />

        </div>
      </div>
    </div>
  )
}
