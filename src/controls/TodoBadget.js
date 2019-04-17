import React, { PureComponent } from 'react';
import { Badge } from 'antd-mobile';
import TodoStore from '../store';
import { Container } from 'flux/utils';

class TodoBadget extends PureComponent {
    static getStores() {
        return [TodoStore];
    }
    static calculateState() {
        return {
            count: TodoStore.getCount().todo,
        };
    }
    state = {
        count: '',
    }
    render() {
        return (<Badge text={this.state.count} overflowCount={99}>
            {this.props.children}
        </Badge>
        );
    }
}

export default Container.create(TodoBadget);
