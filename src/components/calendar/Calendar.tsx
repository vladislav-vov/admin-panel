import { useContext, useEffect } from 'react';
import { Calendar as LibCalender } from 'react-calendar';

import { AppointmentContext } from '../../context/appointments/AppointmentsContext';

import 'react-calendar/dist/Calendar.css';
import './calendar.scss';

function Calendar() {
	const { calendarDate, setDateAndFilter } = useContext(AppointmentContext);

	useEffect(() => {
		setDateAndFilter([null, null]);

		// eslint-disable-next-line
	}, []);

	return (
		<div className="calendar">
			<LibCalender
				value={calendarDate}
				onChange={(value) => {
					setDateAndFilter(value);
				}}
				selectRange
			/>
			<button
				className="calendar__reset"
				disabled={
					Array.isArray(calendarDate) && calendarDate[0] && calendarDate[1]
						? false
						: true
				}
				onClick={() => setDateAndFilter([null, null])}>
				Reset filters
			</button>
		</div>
	);
}

export default Calendar;
