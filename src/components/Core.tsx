import React, { Component } from 'react'

import { Stack } from 'office-ui-fabric-react/lib//Stack';
import { mergeStyleSets, DefaultPalette } from 'office-ui-fabric-react/lib/Styling';

import { Customizer } from 'office-ui-fabric-react';
import { FluentCustomizations } from '@uifabric/fluent-theme';

import Header from './Header';
import ItemList from './ItemList';

export default class Core extends Component<{}, {}> {

    

    render(): JSX.Element {

        const styles = mergeStyleSets({
            root: {
                background: DefaultPalette.themeTertiary,
                margin: 20,
            },

            item: {
                color: DefaultPalette.white,
                background: DefaultPalette.themePrimary,
                padding: 10,
            }
        });

        return (
            <Customizer {...FluentCustomizations}>
                <Stack className={styles.root}>
                    <Stack.Item align="center" className={styles.item}>
                        <Header></Header>
                        <ItemList></ItemList>
                    </Stack.Item>
                </Stack>
            </Customizer>
        )
    }
}
