//App.js

import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import MainMakePage from "./pages/make/MainMakePage.jsx";
import MakePage from "./pages/make/MakePage.jsx";
import SharePage from "./pages/make/SharePage.jsx";
import MainTestPage from "./pages/quiz/MainTestPage.jsx";
import ScorePage from "./pages/quiz/ScorePage.jsx";
import TestPage from "./pages/quiz/TestPage.jsx";





function App() {
    const isMaker = false;  // 나중에 만든 사람이냐 아니냐로 검증

    return (
        <BrowserRouter basename="/friend_test">
            <Routes>
                <Route path="/main/make" element={<MainMakePage/>}></Route>
                <Route path="/make/:name" element={<MakePage/>}></Route>
                <Route path="/share/:quiz-id" element={<SharePage/>}></Route>

                <Route path="/main/test" element={<MainTestPage/>}></Route>
                <Route path="/test" element={<TestPage/>}></Route>
                <Route path="/score" element={<ScorePage/>}></Route>

                {/* <Route path="/score-detail" element={<ScorePage/>}></Route>
                <Route path="/*" element={<Notfound />}></Route> */}
            </Routes>
        </BrowserRouter>
    )
    }
export default App;
