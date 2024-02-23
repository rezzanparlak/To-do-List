

var lists = loadFromLocalStorage();
var selectedId;
var tasks  = loadTasks();
var completedTasks = loadCompletedTasks();


$(function () {

    renderAllLists();
    removeListSelected();

    $("#mainPage").addClass("selected");

    $(".projectMembers").on("click", function() {
        $("#to-do").css("display", "none");
        $("#pjMem").css("display", "block");
        removeSelected();
        $("#mainPage").addClass("selected");
    })

    $("#newList").on("click", function() {
        $(".popUp").css("display", "block");
        $("#overlay").css("opacity", "0.5");
        $("#listInput").focus();
    })

    $("#quit").on("click", function() {
        $(".popUp").css("display", "none");
        $("#overlay").css("opacity", "0");
    })


    $("#create").on("click", function() {
        let listName = $("#listInput").val().trim();
        if(listName !== "")
        {
            let taskCount = 0;
            let list = {listName, taskCount};
            lists.push(list);
            renderList(list);
            saveToLocalStorage();
            lists = loadFromLocalStorage();
            showInit(list.listName);
            let completedTask  = [];
            completedTasks.push(completedTask);
            saveCompletedTasks();
            $("#listInput").val("");
            $(".popUp").css("display", "none");
            $("#overlay").css("opacity", "0");
            $("#mainPage").removeClass("selected");
        } else 
        {
            alert("Type a list name");
        }
    })

    $("#listInput").on("keydown", function(e) {
        if(e.key == "Enter")
        {
            let listName = $("#listInput").val().trim();
        
            if(listName !== "")
            {
                let taskCount = 0;
                let list = {listName, taskCount}
                lists.push(list);
                removeSelected();
                renderList(list);
                saveToLocalStorage();
                lists = loadFromLocalStorage();
                showInit(list.listName);
                let completedTask  = [];
                completedTasks.push(completedTask);
                saveCompletedTasks();
                $("#listInput").val("");
                $(".popUp").css("display", "none");
                $("#overlay").css("opacity", "0");
                $("#mainPage").removeClass("selected");
            } else 
            {
                alert("Type a list name");
            }
        }
    })

    $(document).on("click", "li",function() {
        selectedId = $(this).index();

         removeSelected();

         $(this).children().children().eq(0).addClass("selected");
         $("#mainPage").removeClass("selected")
         $("#to-do").css("display", "flex");
         $("#pjMem").css("display", "none");
 
         $("#taskInfo").children().remove();
 
         renderTaskItems(selectedId);
 
         let list = lists[selectedId];
 
         $("#addTask").focus();
 
         $("#taskInfo").prepend(`
                             <h1>${list.listName}</h1>
 
                             `)
     })

    $(document).on("click", "#trashcan", function(e) {
        let id = $(this).parent().parent().index();
        $(this).parent().parent().remove();
        lists.splice(id, 1);
        deleteItems(id);
        saveToLocalStorage();
        e.stopPropagation();

        completedTasks.splice(id, 1);
        saveCompletedTasks();
        for(let i=0;i<tasks.length;i++)
        {
            if(tasks[i].key > id)
            {
                tasks[i].key--;
            }
        }
        saveTasks();
        if(lists.length == 0)
        {
            $("#to-do").css("display", "none");
            $("#pjMem").css("display", "block");
            $("#mainPage").addClass("selected");
        }
        else if(id === 0)
        {
            show(id);
            removeAllLists();
            renderAllLists();
            removeSelected();
            $("li").eq(0).children().children().eq(0).addClass("selected");
        }
        else
        {
            show((id-1));
            removeAllLists();
            renderAllLists();
            removeSelected();
            $("li").eq((id-1)).children().children().eq(0).addClass("selected");
        }
    })

    $("#addTask").on("keydown", function(e) {
        if(e.key == "Enter")
        {
            let taskName = $(this).val().trim();
            if(taskName !== 0)
            {
                let task = {key : selectedId, name : taskName};
                tasks.push(task);
                saveTasks();
                
                $("#taskInfo").append(`
                                    <div class="newTask">
                                        <input type="checkbox" id="checkBox">
                                        <div>
                                            ${taskName}
                                        </div>
                                    </div>
                `);
            }
            $(this).val("");
            $(this).focus();
            countIncr(selectedId);
            removeAllLists();
            renderAllLists();
            removeSelected();
            $("li").eq(selectedId).children().children().eq(0).addClass("selected");
        }
    })

    $(document).on("click", ".newTask", function() {
        if($(this).children().prop("checked") == false)
        {
            $(this).children().prop("checked", true);
            $(this).children().eq(1).toggleClass("line-through");
            countDecr(selectedId);
            completedTasks[selectedId].push(($(this).index()-1));
        }
        else
        {
            $(this).children().prop("checked", false);
            $(this).children().eq(1).removeClass("line-through");
            countIncr(selectedId);
            for(let i=0;i<completedTasks[selectedId].length;i++)
            {
                if(completedTasks[selectedId][i] == ($(this).index()-1))
                {
                    completedTasks[selectedId].splice(i, 1);
                }
            }
        }
        removeAllLists();
        renderAllLists();
        removeSelected();
        $("li").eq(selectedId).children().children().eq(0).addClass("selected");
        saveCompletedTasks();
    })
})

function saveCompletedTasks() {
    localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


function saveToLocalStorage() {
    localStorage.setItem("lists", JSON.stringify(lists));
}

function loadCompletedTasks() {
    let data = localStorage.getItem("completedTasks")
    return data ? JSON.parse(data) : []
}

function loadTasks() {
    let data = localStorage.getItem("tasks")
    return data ? JSON.parse(data) : []
}

function loadFromLocalStorage() {
    let data = localStorage.getItem("lists")
    return data ? JSON.parse(data) : []
}

function renderList(list) {
    if(list.taskCount !== 0)
    {
        $("#tasks").append(`<li id="listNum">
                                        <div class="listItem" id="leftHover">
                                            <div class="selected">
                                            </div>
                                            <div>
                                                <i class="fa-solid fa-bars"></i>
                                            </div>
                                            <div id="listN">
                                                <span>${list.listName}</span>
                                            </div>
                                            <div id="trashcan">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </div>
                                            <div id="count">
                                                ${list.taskCount}
                                            </div>
                                        </div>
                </li>`)
    }
    else
    {
        $("#tasks").append(`<li id="listNum">
                                        <div class="listItem" id="leftHover">
                                            <div class="selected">
                                            </div>
                                            <div>
                                                <i class="fa-solid fa-bars"></i>
                                            </div>
                                            <div id="listN">
                                                <span>${list.listName}</span>
                                            </div>
                                            <div id="trashcan">
                                                <i class="fa-solid fa-trash-can"></i>
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                </li>`)
    }
}

function renderAllLists() {
    for (let l of lists) {
        renderList(l)
    }
}

function removeAllLists() {
    for(let i=0;i<lists.length;i++)
    {
        $("li").remove();
    }
}

/*function renderTaskItems(id) {
    //alert(id);
    for(let I of tasks) {
        if(I.key == id)
        {
            $("#taskInfo").append(`
                        <div class="newTask">
                            <input type="checkbox" id="checkBox">
                            <div>
                                ${I.name}
                            </div>
                        </div>
                    `);
        }
    }
}*/

function renderTaskItems(id) {
    let i = 0;
    let j = 0;
    for(let I of tasks) {
        if(I.key == id)
        {
                if(completedTasks[id][i] == j)
                {
                    $("#taskInfo").append(`
                        <div class="newTask">
                            <input type="checkbox" id="checkBox" checked>
                            <div class="line-through">
                                ${I.name}
                            </div>
                        </div>
                    `);
                    i++;
                }
                else
                {
                    $("#taskInfo").append(`
                        <div class="newTask">
                            <input type="checkbox" id="checkBox">
                            <div>
                                ${I.name}
                            </div>
                        </div>
                    `);
                }
            
            j++;
        }
    }
}

function countIncr(id) {
    lists[id].taskCount++;
    saveToLocalStorage();
}

function countDecr(id) {
    lists[id].taskCount--;
    saveToLocalStorage();
}

function deleteItems(id) {
    for(let i=0;i<tasks.length;i++)
    {
        if(tasks[i].key == id)
        {
            tasks.splice(i, 1);
            i--;
        }
    }
    saveTasks();
}

function show(id) {
    $("#taskInfo").children().remove();

    renderTaskItems(id);

    let list = lists[id];
 
    $("#addTask").focus();
 
    $("#taskInfo").prepend(`
            <h1>${list.listName}</h1>
 
                        `)
}

function showInit(listName) {
         $("#to-do").css("display", "flex");
         $("#pjMem").css("display", "none");
 
         $("#taskInfo").children().remove();

         selectedId = (lists.length - 1);
 
         $("#addTask").focus();
 
         $("#taskInfo").prepend(`
                             <h1>${listName}</h1>
 
                             `)
}

function removeListSelected() {
    for(let i=0;i<lists.length;i++)
    {
        $("li").eq(i).children().children().removeClass("selected");
    }
}

/*function controlMainSelected() {
    if(lists.length == 0)
    {
        $("#mainPage").addClass("selected");
    }
    else
    {
        $("#mainPage").removeClass("selected");
    }
}*/

/*function getSelectedId() {
    return selectedId;
}*/

function removeSelected() {
    $("li").children().children().removeClass("selected");
}

/*function focusAddTask() {
    $("#addTask").css("background", "white");
    $(".inputTask").css("background", "white");
}*/

/*function removeFocus() {
    $("#addTask").css("background", "#DDD");
    $(".inputTask").css("background", "#DDD");
}*/