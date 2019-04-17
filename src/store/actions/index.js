import { AppDispatcher } from 'yes';
import { Svr } from 'yes-core';

export const refreshTodoList = async (reload = true) => {
    const url = `${Svr.SvrMgr.ServletURL}/../Pending-list.action`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: 'no=2&pageNo=0',
    });
    const result = await response.json();
    AppDispatcher.dispatch({
        type: 'RECEIVETODOLIST',
        data: result,
        reload,
    });
};

export const refreshRejectList = async (reload = true) => {
    const url = `${Svr.SvrMgr.ServletURL}/../backed-list.action`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
        body: 'no=2&pageNo=0',
    });
    const result = await response.json();
    AppDispatcher.dispatch({
        type: 'RECEIVEREJECTLIST',
        data: result,
        reload,
    });
};
