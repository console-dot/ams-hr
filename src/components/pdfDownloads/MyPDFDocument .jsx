import React, { useEffect, useState } from 'react';
import { getSingleDesignation } from '../../api';
import { Table } from './Table';
import { AbsTable } from './AbsTable';
import { HalfDayTable } from './HalfDayTable';
import { PublicHolidayTable } from './PublicHolidayTable';
import { convertDate } from '../attendanceTable';
import { PresentTable } from './PresentTable';

export const MyPDFDocument = ({ empData }) => {
  const [desi, setDesi] = useState();

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
    <div className="printable">
      <div className="pdf-content">
        <div className="employee-details">
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h2 className='text-lg'>Name:</h2>
              <span className='text-lg underline'>{empData?.user?.name}</span>
            </div>
            <div className='flex items-center gap-4'>
              <h2 className='text-lg'>Employee ID:</h2>
              <span className='text-lg underline'>{empData?.user?.employeeId}</span>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            <h2 className='text-lg'>Designation:</h2>
            <span className='text-lg underline'>{desi?.title}</span>
          </div>
          <div className='flex items-center gap-4'>
            <h2 className='text-lg'>Phone No:</h2>
            <span className='text-lg underline'>{empData?.user?.phone}</span>
          </div>
          <div className='flex items-center gap-4'>
          <h2 className='text-lg'>Email:</h2>
          <span className='text-lg underline'>{empData?.user?.email}</span></div>
      </div>
        </div>
        

      <PresentTable heading="Presents" header={['Date', 'Login Time', 'Logout Time', 'Status']} data={empData?.attendance} />
      <AbsTable heading="Absents" header={['Date', 'Status']} data={empData?.abDates} />
      <Table heading="Leaves" header={['Date', 'Status']} data={empData?.leaves} />
      <HalfDayTable heading="Half Days" header={['Date', 'Login Time', 'LogoutTime', 'Status']} data={empData} />
      <PresentTable heading="Full Day" header={['Date', 'Login Time', 'Logout Time', 'Status']} data={fullDay} />
      <PublicHolidayTable heading="Public Holidays" header={['Date', 'Reason']} data={empData?.publicHolidays} />
    </div>

  );
};
