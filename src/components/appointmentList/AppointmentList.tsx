import { useContext, useEffect, useState, useCallback } from 'react';
import { AppointmentContext } from '../../context/appointments/AppointmentsContext';

import AppointmentItem from '../appointmentItem/AppointmentItem';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';
import CancelModal from '../modal/CancelModal';

function AppointmentList() {
	const {
		activeAppointments,
		getActiveAppointments,
		appointmentLoadingStatus,
		calendarDate,
	} = useContext(AppointmentContext);
	const [isOpen, setIsOpen] = useState(false);
	const [selectedId, selectId] = useState(0);

	useEffect(() => {
		getActiveAppointments();

		// eslint-disable-next-line
	}, [calendarDate]);

	const handleOpenModal = useCallback((id: number) => {
		setIsOpen(true);
		selectId(id);
	}, []);

	if (appointmentLoadingStatus === 'loading') {
		return <Spinner />;
	} else if (appointmentLoadingStatus === 'error') {
		return (
			<>
				<Error />
				<button
					className="schedule__reload"
					onClick={getActiveAppointments}>
					Reload
				</button>
			</>
		);
	}

	return (
		<>
			{activeAppointments.length === 0 ? (
				<h2 className="no-data">No data to display</h2>
			) : null}
			{activeAppointments.map((data) => (
				<AppointmentItem
					{...data}
					key={data.id}
					openModal={handleOpenModal}
					getActiveAppointments={getActiveAppointments}
				/>
			))}
			<CancelModal
				handleClose={setIsOpen}
				selectedId={selectedId}
				isOpen={isOpen}
			/>
		</>
	);
}

export default AppointmentList;
