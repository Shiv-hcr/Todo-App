$(document).ready(function() {
    console.log("Executing script.js...");

    const $taskInput = $("#taskInput");
    const $taskList = $("#taskList");
    const $addTaskBtn = $("#addTaskBtn");

    async function fetchTasks() {
        const result = await fetch("/api/tasks");
        const tasks = await result.json();
        console.log(tasks);
        $taskList.empty();
        tasks.forEach(task => addTaskToDom(task));
    }

    function addTaskToDom(task) {
        const $list = $(`<li class="${task.status}">${task.description}</li>`);
        $list.data("id", task.id);

        const $deleteBtn = $(`<button>Delete</delete>`).click(deleteTask);
        $list.append($deleteBtn);
        $list.click(completeTask);

        $taskList.append($list);
    }

    $addTaskBtn.click(async () => {
        const description = $taskInput.val().trim();
        if (description) {
            const result = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ description }),
            });
            const newTask = await result.json();
            addTaskToDom(newTask);
            $taskInput.val("");
        }
    });

    async function comepleteTask(list) {
        const $li = $(list.target);
        const taskID = $li.data("id");
        await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
        $li.remove();
    }

    fetchTasks();
});