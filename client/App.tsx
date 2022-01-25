import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimateSharedLayout } from "framer-motion";
import "./app.css";
import LayoutCards from "./components/LayoutCards";

export default function App(): JSX.Element {
    return (
        <div className="container">
            <AnimateSharedLayout>
                <Router>
                    <Routes>
                        <Route path="*" element={<LayoutCards />} />
                    </Routes>
                </Router>
            </AnimateSharedLayout>
        </div>
    );
}
