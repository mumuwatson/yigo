import { Store } from 'flux/utils';
import { AppDispatcher, BillformStore } from 'yes';

// let todoListCount = 0;
const data = {
    todo: 0,
    reject: 0,
};

class TodoListStore extends Store {
    __onDispatch(action) {
        switch (action.type) {
            case 'RECEIVETODOLIST':
                if (action.reload && data.todo !== action.data.totalRecords) {
                    setTimeout(
                        () => BillformStore.reloadFormData('TSL_ToDoList.-1')
                        , 0);
                }
                data.todo = action.data.totalRecords;
                this.__emitChange();
                break;
            case 'RECEIVEREJECTLIST':
                if (action.reload && data.reject !== action.data.totalRecords) {
                    setTimeout(
                        () => BillformStore.reloadFormData('TSL_RejectWF.-1')
                        , 0);
                }
                data.reject = action.data.totalRecords;
                this.__emitChange();
                break;
            default:

        }
    }
    getCount() {
        return data;
    }
}

export default new TodoListStore(AppDispatcher);
