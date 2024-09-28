import { useRef, useEffect, useState, useContext } from 'react';
import { CSSTransition } from 'react-transition-group';

import { AppointmentContext } from '../../context/appointments/AppointmentsContext';
import useAppointmentService from '../../services/AppointmentService';

import Portal from '../portal/Portal';

import './modal.scss';

interface IModalProps {
	handleClose: (state: boolean) => void;
	isOpen: boolean;
	selectedId: number;
}

function CancelModal({ handleClose, selectedId, isOpen }: IModalProps) {
	const { getActiveAppointments } = useContext(AppointmentContext);
	const { cancelOneAppointment } = useAppointmentService();

	const nodeRef = useRef<HTMLDivElement | null>(null);
	const cancelStatusRef = useRef<boolean | null>(null);

	const [btnDisabled, setBtnDisabled] = useState(false);
	const [cancelStatus, setCancelStatus] = useState<boolean | null>(null);

	const handleCancelAppointment = (id: number) => {
		setBtnDisabled(true);
		cancelOneAppointment(id)
			.then(() => setCancelStatus(true))
			.catch(() => {
				setBtnDisabled(false);
				setCancelStatus(false);
			});
	};

	const closeOnEscapeKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeModal();
		}
	};

	const closeModal = () => {
		handleClose(false);

		if (cancelStatusRef.current) {
			getActiveAppointments();
		}
	};

	useEffect(() => {
		cancelStatusRef.current = cancelStatus;
	}, [cancelStatus]);

	useEffect(() => {
		document.addEventListener('keydown', closeOnEscapeKey);

		return () => {
			document.removeEventListener('keydown', closeOnEscapeKey);
		};

		// eslint-disable-next-line
	}, [handleClose]);

	return (
		<Portal>
			<CSSTransition
				in={isOpen}
				timeout={{ enter: 500, exit: 500 }}
				unmountOnExit
				classNames="modal"
				nodeRef={nodeRef}>
				<div
					className="modal"
					ref={nodeRef}>
					<div className="modal__body">
						<span className="modal__title">
							Are you sure you want to delete the appointment? #{selectedId}
						</span>
						<div className="modal__btns">
							<button
								disabled={btnDisabled}
								className="modal__ok"
								onClick={() => handleCancelAppointment(selectedId)}>
								Ok
							</button>
							<button
								className="modal__close"
								onClick={closeModal}>
								Close
							</button>
						</div>
						<div className="modal__status">
							{cancelStatus === null
								? ''
								: cancelStatus
								? 'Success'
								: 'Error, try again!'}
						</div>
					</div>
				</div>
			</CSSTransition>
		</Portal>
	);
}

export default CancelModal;
