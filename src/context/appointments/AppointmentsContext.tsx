import React, { createContext, useReducer } from 'react';
import { Value as CalendarValue } from 'react-calendar/dist/cjs/shared/types';

import reducer, { IAppointmentState } from './reducer';
import { ActionsTypes } from './actions';

import useAppointmentService from '../../services/AppointmentService';

interface IProviderProps {
	children: React.ReactNode;
}

interface AppointmentContextValue extends IAppointmentState {
	getAppointments: () => void;
	getActiveAppointments: () => void;
	setDateAndFilter: (newDate: CalendarValue) => void;
}

const initialState: IAppointmentState = {
	allAppointments: [],
	activeAppointments: [],
	appointmentLoadingStatus: 'idle',
	calendarDate: [null, null],
};

export const AppointmentContext = createContext<AppointmentContextValue>({
	allAppointments: initialState.allAppointments,
	activeAppointments: initialState.activeAppointments,
	appointmentLoadingStatus: initialState.appointmentLoadingStatus,
	calendarDate: initialState.calendarDate,
	getAppointments: () => {},
	getActiveAppointments: () => {},
	setDateAndFilter: (newDate: CalendarValue) => {},
});

const AppointmentContextProvider = ({ children }: IProviderProps) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { loadingStatus, getAllAppointments, getAllActiveAppointments } =
		useAppointmentService();

	const value: AppointmentContextValue = {
		allAppointments: state.allAppointments,
		activeAppointments: state.activeAppointments,
		appointmentLoadingStatus: loadingStatus,
		calendarDate: state.calendarDate,
		getAppointments: () => {
			getAllAppointments()
				.then((data) => {
					const filteredData = data.filter((item) => {
						if (
							Array.isArray(state.calendarDate) &&
							state.calendarDate[0] &&
							state.calendarDate[1]
						) {
							if (
								new Date(item.date).getTime() >=
									new Date(state.calendarDate[0]).getTime() &&
								new Date(item.date).getTime() <=
									new Date(state.calendarDate[1]).getTime()
							) {
								return item;
							}
						} else return item;
					});

					dispatch({
						type: ActionsTypes.SET_ALL_APPOINTMENTS,
						payload: filteredData,
					});
				})
				.catch((e) => {
					dispatch({ type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS });
				});
		},
		getActiveAppointments: () => {
			getAllActiveAppointments()
				.then((data) => {
					const filteredData = data.filter((item) => {
						if (
							Array.isArray(state.calendarDate) &&
							state.calendarDate[0] &&
							state.calendarDate[1]
						) {
							if (
								new Date(item.date).getTime() >=
									new Date(state.calendarDate[0]).getTime() &&
								new Date(item.date).getTime() <=
									new Date(state.calendarDate[1]).getTime()
							) {
								return item;
							}
						} else return item;
					});

					dispatch({
						type: ActionsTypes.SET_ACTIVE_APPOINTMENTS,
						payload: filteredData,
					});
				})
				.catch((e) => {
					dispatch({ type: ActionsTypes.ERROR_FETCHING_APPOINTMENTS });
				});
		},
		setDateAndFilter: (newDate: CalendarValue) => {
			dispatch({ type: ActionsTypes.SET_CALENDAR_DATE, payload: newDate });
		},
	};

	return (
		<AppointmentContext.Provider value={value}>
			{children}
		</AppointmentContext.Provider>
	);
};

export default AppointmentContextProvider;
