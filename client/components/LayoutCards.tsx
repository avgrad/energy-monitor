import { useMatch } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import CardLarge from "./Card/CardLarge";
import CardList from "./Card/CardList";
import Header from "./Header";

export default function LayoutCards() {
    const match = useMatch("/device/:id");
    const selectedId = match?.params.id;

    return (
        <>
            <Header />
            <CardList />
            <AnimatePresence>
                {selectedId && <CardLarge id={selectedId} key="item" />}
            </AnimatePresence>
        </>
    );
}
