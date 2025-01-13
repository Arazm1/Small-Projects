const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');


//Show the current tasks
async function fetchCurrentTasks() {
    try {
        const response = await fetch('http://127.0.0.1:3000/show_tasks');
        const data = await response.json();

        data.forEach(todo => {
            const { id, name, status } = todo;
            let todoTask = document.createElement("li");
            todoTask.innerHTML = name;
            todoTask.dataset.id = id;
            if (status) {
                todoTask.classList.add("checked");
            }

            listContainer.appendChild(todoTask);

            let span = document.createElement('span');
            span.innerHTML = "\u00d7";
            todoTask.appendChild(span);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

fetchCurrentTasks();


//Add tasks and also send it to the server
async function addTask() {
    if (inputBox.value.trim() == '') {
        alert("Box cannot be empty")
        return;
    }

    let todoTask = document.createElement("li");
    todoTask.innerHTML = inputBox.value;
    listContainer.appendChild(todoTask);


    //Sending data to the server here
    try {
        const response = await fetch('http://127.0.0.1:3000/add_task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input_box: inputBox.value }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error occurred:", errorData.Error || "Unknown error");
            alert(errorData.Error || "Failed to add task on the server.");
            listContainer.removeChild(todoTask);
            return;
        }

        const data = await response.json();
        console.log("Server response:", data);

        inputBox.value = '';
    } catch (error) {
        console.error("Error:", error);
        alert("An unexpected error occurred. Please try again.");
        listContainer.removeChild(todoTask);
    }
}


//Deletes task
listContainer.addEventListener("click", async function (e) {
    if (e.target.tagName === "SPAN") { // "x" button
        const taskItem = e.target.parentElement;
        const taskId = taskItem.dataset.id;

        if (confirm("Are you sure you want to delete this task?")) {
            try {
                const response = await fetch('http://127.0.0.1:3000/del_task', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: taskId }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error occurred:", errorData.Error || "Unknown error");
                    alert(errorData.Error || "Failed to remove task on the server.");
                    return;
                }

                const data = await response.json();
                console.log("Server response:", data);
                taskItem.remove();
            } catch (error) {
                console.error("Error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    }
});


//Updates the status of task
listContainer.addEventListener("click", async function(e) {
    if (e.target.tagName === "LI"){
        const taskId = e.target.dataset.id;
        const checked = e.target.classList.toggle("checked");


        try {
            const response = await fetch('http://127.0.0.1:3000/update_status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: taskId, status: checked }),
        });
        const data = await response.json();
        console.log("Server response:", data);
    } catch (error) {
        console.error("Error updating status:", error);
    }
}
});
