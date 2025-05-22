// online-ide/src/components/CodeEditor.jsx
import { useState, useRef, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

function CodeEditor() {
  const [code, setCode] = useState('// Write your code here...');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [fileName, setFileName] = useState('untitled.js');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const editorRef = useRef(null);
  
  // Update file extension when language changes
  useEffect(() => {
    const fileNameWithoutExt = fileName.split('.')[0];
    let extension = '.js';
    
    switch(language) {
      case 'javascript':
        extension = '.js';
        break;
      case 'typescript':
        extension = '.ts';
        break;
      case 'html':
        extension = '.html';
        break;
      case 'css':
        extension = '.css';
        break;
      case 'python':
        extension = '.py';
        break;
      case 'java':
        extension = '.java';
        break;
      case 'csharp':
        extension = '.cs';
        break;
      case 'cpp':
        extension = '.cpp';
        break;
      default:
        extension = '.txt';
    }
    
    setFileName(fileNameWithoutExt + extension);
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSaveFile();
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleFormatDocument = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };
  
  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };
  
  const handleSaveFile = () => {
    // In a real application, this would save to a server or local storage
    // For now, we'll just create a download link
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // Show a temporary "Saved" message
    const saveButton = document.getElementById('save-button');
    const originalText = saveButton.textContent;
    saveButton.textContent = 'Saved!';
    saveButton.disabled = true;
    setTimeout(() => {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    }, 1500);
  };
  
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // Simulate code execution
    setTimeout(() => {
      try {
        let result = '';
        
        if (language === 'javascript') {
          // For JavaScript, we can actually run it
          // Capture console.log output
          const originalConsoleLog = console.log;
          const logs = [];
          console.log = (...args) => {
            logs.push(args.map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg) : arg
            ).join(' '));
          };
          
          // Execute the code in a try-catch block
          try {
            // eslint-disable-next-line no-new-func
            const executeCode = new Function(code);
            executeCode();
            result = logs.join('\n');
          } catch (error) {
            result = `Error: ${error.message}`;
          }
          
          // Restore console.log
          console.log = originalConsoleLog;
        } else {
          // For other languages, just simulate execution
          result = `[Simulated ${language.toUpperCase()} execution]\n`;
          result += `Code length: ${code.length} characters\n`;
          result += `This is a simulated output. In a real environment, your ${language} code would be executed on a server.`;
        }
        
        setOutput(result || 'No output');
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  return (
    <div className="code-editor-panel">
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <label htmlFor="language-select">Language:</label>
          <select 
            id="language-select" 
            value={language} 
            onChange={handleLanguageChange}
            className="editor-select"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        <div className="toolbar-group">
          <label htmlFor="theme-select">Theme:</label>
          <select 
            id="theme-select" 
            value={theme} 
            onChange={handleThemeChange}
            className="editor-select"
          >
            <option value="vs-dark">Dark</option>
            <option value="vs-light">Light</option>
            <option value="hc-black">High Contrast Dark</option>
            <option value="hc-light">High Contrast Light</option>
          </select>
        </div>
        <div className="toolbar-group">
          <input 
            type="text" 
            value={fileName}
            onChange={handleFileNameChange}
            className="editor-input"
            aria-label="File name"
          />
          <button 
            id="save-button"
            onClick={handleSaveFile}
            className="editor-button"
          >
            Save
          </button>
        </div>
        <div className="toolbar-group">
          <button 
            onClick={handleFormatDocument}
            className="editor-button"
          >
            Format
          </button>
          <button 
            onClick={handleRunCode}
            className="editor-button run-button"
            disabled={isRunning}
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      <div className="editor-container">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme={theme}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            renderLineHighlight: 'all',
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>
      {output && (
        <div className="editor-output">
          <div className="output-header">
            <span>Output</span>
            <button 
              onClick={() => setOutput('')}
              className="clear-button"
            >
              Clear
            </button>
          </div>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}

export default CodeEditor;
