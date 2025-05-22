import './index.css'; // Using index.css for consolidated styles
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import Terminal from './components/Terminal';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <div className="app-container">
      <FileExplorer />
      <div className="main-area">
        <CodeEditor />
        <Terminal />
      </div>
      <AIAssistant />
    </div>
  );
}
export default App;
