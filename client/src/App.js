//App.js

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import './App.css';
import MainMakePage from "./pages/make/MainMakePage.jsx";
import MakePage from "./pages/make/MakePage.jsx";
import SharePage from "./pages/make/SharePage.jsx";
import MainTestPage from "./pages/quiz/MainTestPage.jsx";
import ScoreDetailPage from "./pages/quiz/ScoreDetailPage.jsx";
import ScorePage from "./pages/quiz/ScorePage.jsx";
import TestPage from "./pages/quiz/TestPage.jsx";





function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/main/make" element={<MainMakePage/>}></Route>
                <Route path="/make/:name" element={<MakePage/>}></Route>
                <Route path="/share/:quizId" element={<SharePage/>}></Route>

                <Route path="/main/test/:quizId" element={<MainTestPage/>}></Route>
                <Route path="/test/:quizId" element={<TestPage/>}></Route>
                <Route path="/score/:answerNo" element={<ScorePage/>}></Route>

                <Route path="/score-detail/:answerNo" element={<ScoreDetailPage/>}></Route>
                <Route path="/" element={<Navigate to="/main/make" replace />} />
            </Routes>
        </BrowserRouter>
    )
    }
export default App;
