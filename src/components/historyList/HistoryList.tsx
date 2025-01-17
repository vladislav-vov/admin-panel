import { useContext, useEffect } from 'react';

import { AppointmentContext } from '../../context/appointments/AppointmentsContext';

import AppointmentItem from '../appointmentItem/AppointmentItem';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

function HistoryList() {
	const {
		allAppointments,
		getAppointments,
		appointmentLoadingStatus,
		calendarDate,
	} = useContext(AppointmentContext);

	useEffect(() => {
		getAppointments();

		// eslint-disable-next-line
	}, [calendarDate]);

	if (appointmentLoadingStatus === 'loading') {
		return <Spinner />;
	} else if (appointmentLoadingStatus === 'error') {
		return (
			<>
				<Error />
				<button
					className="schedule__reload"
					onClick={getAppointments}>
					Reload
				</button>
			</>
		);
	}

	return (
		<>
			{allAppointments.length === 0 ? (
				<h2 className="no-data">No data to display</h2>
			) : null}
			{allAppointments.map((data) => (
				<AppointmentItem
					{...data}
					key={data.id}
				/>
			))}
		</>
	);
}

export default HistoryList;
