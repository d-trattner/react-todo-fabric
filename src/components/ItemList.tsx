import React, { Component } from "react";

import { Fabric } from "office-ui-fabric-react/lib/Fabric";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  IColumn,
} from "office-ui-fabric-react/lib/DetailsList";
import { MarqueeSelection } from "office-ui-fabric-react/lib/MarqueeSelection";
import { Toggle } from "office-ui-fabric-react/lib/Toggle";

import {
  Dialog,
  DialogType,
  DialogFooter
} from "office-ui-fabric-react/lib/Dialog";
import {
  PrimaryButton,
  DefaultButton
} from "office-ui-fabric-react/lib/Button";
import { getId } from "office-ui-fabric-react/lib/Utilities";
import {
  mergeStyles
} from "office-ui-fabric-react/lib/Styling";
import { TextField, ITextField } from "office-ui-fabric-react/lib/TextField";

import Menu from "./Menu";

export interface IItemListState {
  items: IItem[];
  selectionDetails: {};
  hideDialog: boolean;
  newItemValue: string;
  maxKey: number;
}

export interface IItem {
  key: number;
  desc: string;
  done: boolean;
}

const exampleChildClass = mergeStyles({
  display: "block",
  marginBottom: "10px"
});

export default class ItemList extends Component<{}, IItemListState> {
  private _selection: Selection;
  private _allItems: IItem[];
  private _columns: IColumn[];

  private _labelId: string = getId("dialogLabel");
  private _subTextId: string = getId("subTextLabel");

  private _newItemTextField: React.RefObject<ITextField> = React.createRef<
    ITextField
  >();
  /*
  private _list: React.RefObject<IDetailsList> = React.createRef<
    IDetailsList
  >();
  */

  constructor(props: {}) {
    super(props);

    this._selection = new Selection({
      onSelectionChanged: () =>
        this.setState({ selectionDetails: this._getSelectionDetails() })
    });

    this._allItems = [
      {
        key: 0,
        desc: "Rasenmähen",
        done: false
      },
      {
        key: 1,
        desc: "Küche aufräumen",
        done: false
      },
      {
        key: 2,
        desc: "Kochen",
        done: false
      }
    ];
    /*
        for (let i = 0; i < 5; i++) {
            this._allItems.push({
                key: i,
                desc: 'Description ' + i,
                done: false
            });
        }*/
    this._columns = [
      {
        key: "desc",
        name: "Description",
        fieldName: "desc",
        minWidth: 100,
        maxWidth: 200,
        isResizable: true
      },
      {
        key: "done",
        name: "Done",
        fieldName: "done",
        minWidth: 50,
        maxWidth: 50,
        isResizable: true
      }
    ];
    this.state = {
      items: this._allItems,
      selectionDetails: this._getSelectionDetails(),
      hideDialog: true,
      newItemValue: "",
      maxKey: 2
    };
  }

  render(): JSX.Element {
    const { items, selectionDetails } = this.state;

    return (
      <Fabric>
        <Menu
          onNewItemClick={this.newItemClick}
          onMarkDoneClick={this.markDoneClick}
          onDeleteClick={this.deleteClick}
        />
        <div className={exampleChildClass}>{selectionDetails}</div>
        <MarqueeSelection selection={this._selection}>
          <DetailsList
            //componentRef={this._list}
            items={items}
            columns={this._columns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            onItemInvoked={this._onItemInvoked}
            onRenderItemColumn={this._renderItemColumn}
          />
        </MarqueeSelection>
        <Dialog
          hidden={this.state.hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: "New Todo Entry"
            //subText: ''
          }}
          modalProps={{
            titleAriaId: this._labelId,
            subtitleAriaId: this._subTextId,
            isBlocking: false,
            styles: { main: { maxWidth: 450 } }
          }}
        >
          <TextField
            componentRef={this._newItemTextField}
            value={this.state.newItemValue}
            autoFocus
          />
          <DialogFooter>
            <PrimaryButton onClick={this._saveItem} text="Save" />
            <DefaultButton onClick={this._closeDialog} text="Cancel" />
          </DialogFooter>
        </Dialog>
      </Fabric>
    );
  }

  private _itemCopy = (): IItem[] => {
    return JSON.parse(JSON.stringify(this.state.items));
  };

  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  };

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  };

  private _saveItem = (): void => {
    if (this._newItemTextField.current) {
      const items_copy = this._itemCopy();
      const value = this._newItemTextField.current.value;
      if (value) {
        items_copy.push({
          key: this.state.maxKey + 1,
          desc: value,
          done: false
        });
        this.setState({
          hideDialog: true,
          maxKey: this.state.maxKey + 1,
          items: items_copy
        });
      }
    }
  };

  private newItemClick = (): void => {
    console.log("newItemClick");
    this._showDialog();
  };

  private markDoneClick = (): void => {
    console.log("markDoneClick");
    if (this._selection.getSelectedCount()) {
      const items_copy = this._itemCopy();
      const selectedIndices: number[] = this._selection.getSelectedIndices();
      selectedIndices.forEach(i => {
        items_copy[i].done = true;
      });
      this.setState(
        {
          items: items_copy
        },
        () => {
          // if (this._list.current) {
          //     this._list.current.forceUpdate();
          // }
        }
      );
    }
  };

  private deleteClick = (): void => {
    console.log("deleteClick");
        if (this._selection.getSelectedCount()) {
            let items_copy = this._itemCopy();
            const selectedIndices: number[] = this._selection.getSelectedIndices();
            items_copy = items_copy.filter((item, index) => !selectedIndices.includes(index));
            this.setState({
                items: items_copy
            });
        }
  };

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();

    switch (selectionCount) {
      case 0:
        return "No items selected";
      case 1:
        return (
          "1 item selected: " +
          (this._selection.getSelection()[0] as IItem).desc
        );
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onItemInvoked = (item: IItem): void => {
    alert(`Item invoked: ${item.desc}`);
  };

  private _onItemChange = (
    ev: React.MouseEvent<HTMLElement>,
    checked: boolean | undefined
  ): void => {
    if (this._selection.getSelectedCount() && typeof checked !== "undefined") {
      const items_copy = this._itemCopy();
      const selectedIndices: number[] = this._selection.getSelectedIndices();
      selectedIndices.forEach(i => {
        items_copy[i].done = checked;
      });
      this.setState({
        items: items_copy
      });
    }
  };

  private _renderItemColumn = (
    item: IItem,
    index: number | undefined,
    column: IColumn | undefined
  ) => {
    if (column) {
      const fieldContentString = item[
        column.fieldName as keyof IItem
      ] as string;
      const fieldContent = item[column.fieldName as keyof IItem];

      switch (column.key) {
        case "done":
          return (
            <Toggle
              //defaultChecked={false}
              checked={fieldContent as boolean}
              onFocus={() => console.log("onFocus called")}
              onBlur={() => console.log("onBlur called")}
              onChange={this._onItemChange}
            />
          );

        default:
          return <span>{fieldContentString}</span>;
      }
    }
  };
}
