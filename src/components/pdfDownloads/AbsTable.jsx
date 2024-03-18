import React from 'react'
import { convertDateWithoutTime } from '../attendanceTable'

export const AbsTable = ({ heading, header, data }) => {
    return (
        <div class="flex flex-col">
            <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div class="overflow-hidden">
                        <div className='w-full p-2 flex items-center justify-center bg-[#166583] text-white text-lg'>{heading}</div>
                        <table
                            class="min-w-full text-center text-sm font-light text-surface dark:text-white">

                            <thead
                                class="border-b border-neutral-200 font-medium dark:border-white/10">
                                <tr>
                                    <th scope="col" class=" px-6 py-4">#</th>
                                    {header?.map((i) => <th scope="col" class=" px-6 py-4">{i}</th>)}

                                </tr>
                            </thead>
                            <tbody>
                                {data?.map((i, index) => <tr class="border-b border-neutral-200 dark:border-white/10">
                                    <td class="whitespace-nowrap  px-6 py-4 font-medium">{index + 1}</td>
                                    <td class="whitespace-nowrap  px-6 py-4">{convertDateWithoutTime(i, "full")}</td>
                                    <td class="whitespace-nowrap  px-6 py-4">--</td>

                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
