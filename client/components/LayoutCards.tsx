import { useCallback } from "react";
import { useMatch } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CardOpen from "./Card/CardOpen";
import CardList from "./Card/CardList";
import Header from "./Header";
import { useDeviceStore } from "../data/Store";

export default function LayoutCards() {
    const match = useMatch("/device/:id");
    const selectedId = match?.params.id;
    const selectedDeviceExists = useDeviceStore(
        useCallback(
            (s) => !!selectedId && !!s.devices[selectedId],
            [selectedId]
        )
    );

    return (
        <>
            <Header />
            <CardList />
            <AnimatePresence>
                {selectedDeviceExists && selectedId && (
                    <CardOpen id={selectedId} key="item" />
                )}
            </AnimatePresence>
        </>
    );
}
