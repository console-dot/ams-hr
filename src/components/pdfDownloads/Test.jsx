import { Document, Page, Text } from '@react-pdf/renderer'
import React, { useEffect, useState } from 'react'
import { getSingleDesignation } from '../../api';
import { Table } from './Table';
import { AbsTable } from './AbsTable';
import { HalfDayTable } from './HalfDayTable';
import { PublicHolidayTable } from './PublicHolidayTable';
import { convertDate } from '../attendanceTable';

export const Test = ({ empData }) => {
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

  return (
    <div className=''>
        <div className='p-4'>
          <div className='flex w-full'>
            <div className='p-4 flex flex-col gap-4' style={{ width: "80%" }}>
              <div className='flex items-center gap-12'>
                <h2 className='text-xl font-bold ' style={{width:"112px"}}>Name : </h2>
                <h2>{empData?.user?.name}</h2>
              </div>
              <div className='flex items-center gap-12'>
                <h2 className='text-xl font-bold w-48' style={{width:"112px"}}>Employe ID :</h2>
                <h2>{empData?.user?.employeeId}</h2>
              </div>
              <div className='flex items-center gap-12'>
                <h2 className='text-xl font-bold w-48' style={{width:"112px"}}>Designation :</h2>
                <h2>{desi?.title}</h2>
              </div>
              <div className='flex items-center gap-12'>
                <h2 className='text-xl font-bold w-48' style={{width:"112px"}}>Phone No :</h2>
                <h2>{empData?.user?.phone}</h2>
              </div>
              <div className='flex items-center gap-12'>
                <h2 className='text-xl font-bold w-48' style={{width:"112px"}}>Email :</h2>
                <h2>{empData?.user?.email}</h2>
              </div>
              {/* <div className='flex items-center gap-12'F>
                <h2 className='text-xl font-bold w-48' style={{width:"112px"}}>Report Duration :</h2>
                <h2>{` ${startDate} -- ${endDate}`}</h2>
              </div> */}

            </div>
            <div className='flex justify-center'> <img src="/logo.jpg" alt="" width={200} height={100} style={{width:"150px",height:"150px"}}/> </div>
          </div>
          <div className='flex flex-col gap-12 mt-12'>
            <Table heading={'Leaves'} header={['Date', 'Status']} data={empData?.leaves} />
            <AbsTable heading={"Absents"} header={['Date', 'Status']} data={empData?.abDates} />
            <HalfDayTable heading={"Half Days"} header={['Date', 'Login Time', 'LogoutTime', 'Status']} data={empData} />
            <PublicHolidayTable heading={"Public Holidays"} header={['Date', 'Reason']} data={empData?.publicHolidays} />
          </div>
        </div>
    </div>
  )
}
