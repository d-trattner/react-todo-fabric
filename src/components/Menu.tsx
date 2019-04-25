import React, { Component } from 'react'

import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';

export interface IMenuProps {
    onNewItemClick(): void
    onMarkDoneClick(): void
    onDeleteClick(): void
}

export default class Menu extends Component<IMenuProps, {}> {

    render(): JSX.Element {
        return (
        <div>
            <CommandBar
            items={this.getItems()}
            ariaLabel={'Use left and right arrow keys to navigate between commands'}
            />
        </div>
        )
    }

    newItem = () => {
        this.props.onNewItemClick();
    }

    markDone = () => {
        this.props.onMarkDoneClick();
    }

    delete = () => {
        this.props.onDeleteClick();
    }

    // Data for CommandBar
    private getItems = () => {
        return [
        {
            key: 'newItem',
            name: 'New',
            cacheKey: 'myCacheKey', // changing this key will invalidate this items cache
            iconProps: {
            iconName: 'Add'
            },
            ariaLabel: 'New',
            onClick: this.newItem
        },
        {
            key: 'markdone',
            name: 'Mark Done',
            iconProps: {
            iconName: 'CheckMark'
            },
            ariaLabel: 'Mark Done',
            onClick: this.markDone
        },
        {
            key: 'deleteall',
            name: 'Delete',
            iconProps: {
            iconName: 'Delete'
            },
            ariaLabel: 'Delete',
            onClick: this.delete
        }
        ];
    };

}
