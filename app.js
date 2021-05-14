

let myObjct = {
    description : ''
}


const place = document.querySelector('.place')
const buttons = document.querySelectorAll('.btn');

const saveButton = document.querySelector('.btn-save')
const loadButton = document.querySelector('.btn-load')
const tools = document.querySelector('.tools')

const showFiles = document.querySelector('.show-files')

const btnShowFiles = document.querySelector('.btn-show-files')
const btnRefresh = document.querySelector('.btn-refresh')


// Here edit text

buttons.forEach(btn => {

    btn.addEventListener('click', ()=>{
        let command = btn.dataset['command'];
        document.execCommand(command,false, null)
    
    })
});
// End edit text


// saves data on disk and in local storage
saveButton.addEventListener('click', save)

function save(e) {
    save = place.innerHTML;
    if(save != '') 
    {
        //Enter the title file

        myObjct.description = save; 
        const b = setTitle()
        const fieldTitle = document.querySelector('.inputTitle')
        
        fieldTitle.addEventListener('keypress', (e)=>{
            if (e.key =='Enter')
            {
                const nameFile = document.querySelector('.inputTitle').value
                
                downloadFile( JSON.stringify(myObjct), `${nameFile}.json` )
                .then(saveToLocalStorage(myObjct.description, nameFile))
                .then( ()=>{ tools.removeChild(b)})
            }

        })

    }

    else{
        alert('Doesnt content') //check if editor have text
    }
}


// Save to local storage
function saveToLocalStorage (description, nameFile){
    return new Promise ((resolve, reject) =>{
        localStorage.setItem(nameFile, JSON.stringify(description));
        resolve()
    })
}

//show files in lists
btnShowFiles.addEventListener('click', ()=>{
    keys = Object.keys(localStorage)
    placeFiles()
    .then(setFiles(keys))
    .then(InnerFromLocalStorage())

}, {once:true})

//Refresh lists files
btnRefresh.addEventListener('click', ()=>{
    if(document.querySelector('.place-to-show-files'))
    {
        showFiles.removeChild(document.querySelector('.place-to-show-files'))
        keys = Object.keys(localStorage)
        placeFiles()
        .then(setFiles(keys))
        .then(InnerFromLocalStorage())
    }
})

//Create input to enter title file
function setTitle(){
    
    const placeToTitle = document.createElement('input');
    placeToTitle.placeholder = 'Enter title to save'
    placeToTitle.className = 'inputTitle'
    tools.appendChild(placeToTitle)
    
    return placeToTitle
}
// function to downoload file to disk
function downloadFile(text, filename){
    return new Promise((resolve, reject) =>{  
        var a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click()
        resolve()
    })
    
}

//Create place where will assigned save files
function placeFiles(){
    return new Promise((resolve, reject) =>{  
        const place = document.createElement('div');
        place.className = 'place-to-show-files'
        showFiles.appendChild(place)
        resolve()   
    })
}
//function to add files to list with trash button
function setFiles (keys){
    return new Promise ((resolve,reject) =>{
        const ul = document.createElement('ul')
        
        keys.forEach(key =>{
            const li = document.createElement('li')
            li.textContent = key
    
            const trashButton = document.createElement('button');
            trashButton.innerHTML = '<i class ="fas fa-trash"></i>';
            trashButton.classList.add('trash-btn');
            trashButton.dataset.key = key
            li.appendChild(trashButton);
            ul.appendChild(li)
        })
        document.querySelector('.place-to-show-files').appendChild(ul)
        resolve()
    })

}

//Funtion to set text from save files

function InnerFromLocalStorage(){

    const listFiles = document.querySelectorAll('li')
    const trashbtns = document.querySelectorAll('.trash-btn')

    
    listFiles.forEach(file =>{

        file.addEventListener('click', (e)=>{
            valueFile = window.localStorage.getItem(file.textContent)
            valueFile = valueFile.slice(1, -1)
            place.innerHTML = valueFile
        })
        
    })

    
//calling function to remove from localStorage and list files

    trashbtns.forEach(btn =>{
        btn.addEventListener('click', ()=>{

            removeFile(listFiles, btn) 

        })
       

    })
    

}

// The function remove file from list and from localstorage

function removeFile (listFiles, btn){
    const ul = document.querySelector('.show-files ul')   
            for(const file of listFiles)
            {
                if(file.textContent == btn.dataset['key']){
                    
                    for(const key in listFiles)
                    {
                        if(listFiles[key].textContent == btn.dataset['key']){
                            ul.removeChild(listFiles[key])
                            localStorage.removeItem(btn.dataset['key'])
                        }
                    }
                }
            }  
}

