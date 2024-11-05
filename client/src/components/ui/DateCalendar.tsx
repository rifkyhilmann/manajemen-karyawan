import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function Calendar() {
  // Get the current date using Day.js
  const currentDate = dayjs(); // This gets today's date

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateCalendar', 'DateCalendar']}>
        <DemoItem label="">
          <div className="p-3 bg-white rounded-md shadow-lg">
            <DateCalendar defaultValue={currentDate} readOnly />
          </div>
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
