const wordCharacters = "_1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";

const numbersCharacters = "1234567890";

var codeDivIdNumber = 0;

function SetProperties(element, properties){
	for(let key in properties){
		if(typeof properties[key]==="object"){
			SetProperties(element[key], properties[key]);
		}
		else{
			element[key] = properties[key];
		}
	}
}

function CreateSpan(properties){
	let span = document.createElement("span");
	SetProperties(span, properties);
	return span;
}

const javaScriptKeywords = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];  
const javaScriptStringDelimiters = "\"'`";
const javaScriptCommentsDelimiters = [["//", '\n'], ["/*", "*/"]];

const pythonKeywords = ["False", "None", "True", "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"];
const pythonStringDelimiters = "'\"";
const pythonCommentsDelimiters = [["#", "\n"]];

const cppKeywords = ["alignas", "alignof", "and", "and_eq", "asm", "auto", "bitand", "bitor", "bool", "break", "case", "catch", "char", "char8_t", "char16_t", "char32_t", "class", "compl", "concept", "const", "consteval", "constexpr", "constinit", "const_cast", "continue", "co_await", "co_return", "co_yield", "decltype", "default", "delete", "do", "double", "dynamic_cast", "else", "enum", "explicit", "export", "extern", "false", "float", "for", "friend", "goto", "if", "inline", "int", "long", "mutable", "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", "private", "protected", "public", "register", "reinterpret_cast", "requires", "return", "short", "signed", "sizeof", "static", "static_assert", "static_cast", "struct", "switch", "template", "this", "thread_local", "throw", "true", "try", "typedef", "typeid", "typename", "union", "unsigned", "using", "virtual", "void", "volatile", "wchar_t", "while", "xor", "xor_eq"];
const cppStringDelimiters = "\'\"";
const cppCommentsDelimiters = [["//", "\n"], ["/*", "*/"]];


async function CreateCodeDiv(appendToId, filePath, language){
	// #1
	let codeDiv = document.createElement("div");
	codeDiv.className = "CodeDiv";
	codeDiv.id = "codeDiv" + codeDivIdNumber.toString();
	
	let title = document.createElement("div");
	title.className = "CodeDivTitle";
	title.innerText = language;
	codeDiv.appendChild(title);

	// #2
	let keyWords = javaScriptKeywords;
	let stringDelimiters = javaScriptStringDelimiters;
	let commentsDelimiters = javaScriptCommentsDelimiters;

	switch(language){
		case "JavaScript":
			keyWords = javaScriptKeywords;
			stringDelimiters = javaScriptStringDelimiters;
			commentsDelimiters = javaScriptCommentsDelimiters;
			break;
		case "Python":
			keyWords = pythonKeywords;
			stringDelimiters = pythonStringDelimiters;
			commentsDelimiters = pythonCommentsDelimiters;
			break;
		case "C++":
			keyWords = cppKeywords;
			stringDelimiters = cppStringDelimiters;
			commentsDelimiters = cppCommentsDelimiters;
			break;
		case "Text":
			keyWords = [];
			stringDelimiters = "";
			commentsDelimiters = [];
			break;
		default:
			keyWords = [];
			stringDelimiters = "";
			commentsDelimiters = [];
	}

	// #3
	let code = "Something went wrong.";

	async function fetchFileContent(url) {
		try {
			const response = await fetch(url);
			const data = await response.text();
			code = data;
			return 0;
		} catch (error) {
			console.error('Error:', error);
		}
	}
	
	await fetchFileContent(filePath);

	// Normalize newlines
	code = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

	let sequenceLength;
	for(let index = 0; index < code.length; index += sequenceLength){
		// #3.1
		let sequence = "";
		let isComment = false;
		for(let index1 = 0; index1 < commentsDelimiters.length; index1++){
			let index2;
			for(index2 = 0; index + index2 < code.length && index2 < commentsDelimiters[index1][0].length; index2++){
				if(code[index + index2] == commentsDelimiters[index1][0][index2]){
					continue;
				}
				break;
			}
			if(index2 == commentsDelimiters[index1][0].length){
				isComment = true;
				sequence += commentsDelimiters[index1][0];
				for(let index3 = index + commentsDelimiters[index1][0].length; index3 < code.length; index3++){
					let index4;
					for(index4 = 0; index3 + index4 < code.length && index4 < commentsDelimiters[index1][0].length; index4++){
						if(code[index3 + index4] == commentsDelimiters[index1][1][index4]){
							continue;
						}
						break;
					}
					if(index4 == commentsDelimiters[index1][1].length){
						break;
					}
					sequence += code[index3];
				}
				sequence += commentsDelimiters[index1][1];
			}
			if(isComment){
				break;
			}
		}
		if(isComment){}
		else if(stringDelimiters.includes(code[index])){
			sequence += code[index];
			for(let index1 = index + 1; index1<code.length && code[index] != code[index1]; index1++){
				sequence += code[index1];
			}
			sequence += code[index + sequence.length];
		}
		else{
			for(let index1 = index; wordCharacters.includes(code[index1]); index1++){
				sequence += code[index1];
			}
		}

		sequenceLength = sequence.length;

		if(sequenceLength == 0){
			sequence = code[index];
			sequenceLength = 1;
		}

		// #3.2
		if(isComment){
			codeDiv.appendChild(CreateSpan({innerText: sequence, style: {color: "var(--color6)"}}));
		}
		else if(keyWords.includes(sequence)){
			codeDiv.appendChild(CreateSpan({innerText: sequence, style: {color: "var(--color4)"}}));
		}
		else if(stringDelimiters.includes(sequence[0])){
			codeDiv.appendChild(CreateSpan({innerText: sequence, style: {color: "var(--color3)"}}));
		}
		else if(numbersCharacters.includes(sequence[0])){
			codeDiv.appendChild(CreateSpan({innerText: sequence, style: {color: "var(--color5)"}}));
		}
		else if(sequenceLength == 1 && !wordCharacters.includes(sequence)){
			codeDiv.appendChild(CreateSpan({innerText: sequence, style: {color: "var(--color0)"}}));
		}
		else{
			codeDiv.appendChild(CreateSpan({innerText: sequence, style: {color: "var(--color2)"}}));
		}
	}

	// #4
	codeDivIdNumber++;

	document.getElementById(appendToId).appendChild(codeDiv);
}
