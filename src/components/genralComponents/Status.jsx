import React from "react";

export const Status = ({ checkin, checkout }) => {
  if (checkout === null || checkout === undefined || checkout === "") {
    return;
  }
  const giveStatus = () => {
    const checkinTime = new Date(checkin);
    const checkoutTime = new Date(checkout);

    if (
      !(checkinTime instanceof Date) ||
      isNaN(checkinTime.getTime()) ||
      !(checkoutTime instanceof Date) ||
      isNaN(checkoutTime.getTime())
    ) {
      // Handle the case where either checkin or checkout time is not a valid Date object
      return "Invalid Date";
    }

    const workingHours = 9 * 60 * 60 * 1000; // 9 hours in milliseconds

    const timeDifference = checkoutTime - checkinTime;

    // Calculate the remaining time with a margin of 15 minutes
    const remainingTime = workingHours - timeDifference - 15 * 60 * 1000;

    // Check if the employee is on time or late
    if (remainingTime <= 0) {
      return "On time";
    } else {
      // Convert the remaining time to hours and minutes
      const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));
      const remainingMinutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );

      return `Late by ${remainingHours} hours and ${remainingMinutes} minutes`;
    }
  };

  return (
    <div className="flex justify-start items-start gap-1">
      <div
        className={`p-1 rounded-md mt-2 bg-${
          giveStatus().includes("Late") ? "red" : "green"
        }-400`}
      ></div>
      <p className={`text-[#b6b1b1]`}>{giveStatus()}</p>
    </div>
  );
};
