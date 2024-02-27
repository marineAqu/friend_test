//App.js

import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import MainMakePage from "./pages/MainMakePage";
import MakePage from "./pages/MakePage";
import SharePage from "./pages/SharePage";




function App() {
    const isMaker = false;  // 나중에 만든 사람이냐 아니냐로 검증

    return (
        <BrowserRouter basename="/friend_test">
            <Routes>
                <Route path="/main/make" element={<MainMakePage/>}></Route>
                <Route path="/make" element={<MakePage/>}></Route>
                <Route path="/share" element={<SharePage/>}></Route>

                {/* <Route path="/main/test" element={<MainTestPage/>}></Route>
                <Route path="/test" element={<TestPage/>}></Route>
                <Route path="/score" element={<ScorePage/>}></Route>
                <Route path="/score-detail" element={<ScorePage/>}></Route>

                <Route path="/*" element={<Notfound />}></Route> */}
            </Routes>
        </BrowserRouter>
    )
    }
export default App;
