//App.js

import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import MainMakePage from "./pages/make/MainMakePage.jsx";
import MakePage from "./pages/make/MakePage.jsx";
import SharePage from "./pages/make/SharePage.jsx";
import MainTestPage from "./pages/quiz/MainTestPage.jsx";
import ScoreDetailPage from "./pages/quiz/ScoreDetailPage.jsx";
import ScorePage from "./pages/quiz/ScorePage.jsx";
import TestPage from "./pages/quiz/TestPage.jsx";





function App() {
    const isMaker = false;  // 나중에 만든 사람이냐 아니냐로 검증

    return (
        <BrowserRouter basename="/friend_test">
            <Routes>
                <Route path="/main/make" element={<MainMakePage/>}></Route>
                <Route path="/make/:name" element={<MakePage/>}></Route>
                <Route path="/share/:quizId" element={<SharePage/>}></Route>

                <Route path="/main/test/:quizId" element={<MainTestPage/>}></Route>
                <Route path="/test/:quizId" element={<TestPage/>}></Route>
                <Route path="/score/:answerNo" element={<ScorePage/>}></Route>

                <Route path="/score-detail/:answerNo" element={<ScoreDetailPage/>}></Route>
                <Route path="/*" element={<MainMakePage/>}></Route>
            </Routes>
        </BrowserRouter>
    )
    }
export default App;
