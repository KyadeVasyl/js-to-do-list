export class Todo {
    static #NAME = 'todo'
    static #list = [];
    static #count = 0;


    static #saveData = () => {
        localStorage.setItem(
            this.#NAME,
            JSON.stringify({
                list: this.#list,
                count: this.#count,
            }),
        )
    }

    static #loadData = () => {
        const data = localStorage.getItem(this.#NAME)

        if (data) {
            const { list, count } = JSON.parse(data);
            this.#list = list;
            this.#count = count;
        }
    }


    static #createTaskData = (text) => {
        this.#list.push({
            id: ++this.#count,
            text,
            done: false,
        })
    }


    static #block = null;
    static #template = null;
    static #input = null;
    static #button = null;

    static init = () => {
        this.#template = document.querySelector('#task').content.firstElementChild

        this.#block = document.querySelector('.task__list')
        this.#input = document.querySelector('.form__input')
        this.#button = document.querySelector('.form__button')
        this.#button.onclick = this.#handleAdd;
        this.#loadData()
        this.#render()
    };

    static #handleAdd = () => {

        const value = this.#input.value;
        if (value.length > 1) {
            this.#createTaskData(value)
            this.#input.value = ''
            this.#render()
            this.#saveData()
        }
    }

    static #render = () => {
        this.#block.innerHTML = '';

        if (this.#list.length === 0) {
            this.#block.innerText = `Список задач пустий`
        } else {
            this.#list.forEach((taskData) => {
                const el = this.#createTaskElem(taskData)
                this.#block.append(el)
            })
        }
    }

    static #createTaskElem = (data) => {
        const el = this.#template.cloneNode(true);

        const [id, text, btnDo, btnDelete] = el.children;

        id.innerText = `${data.id}.`;
        text.innerText = data.text;

        btnDelete.onclick = this.#handleDelete(data);
        btnDo.onclick = this.#handleDo(data, btnDo, el);

        if (data.done) {
            el.classList.add('task--done')

            btnDo.classList.remove('task__button--done')
            btnDo.classList.add('task__button--do')
        }
        return el;
    }

    static #handleDo = (data, btn, el) => () => {
        const result = this.#toggleDone(data.id)

        if (result === true || result === false) {
            el.classList.toggle('task--done')

            btn.classList.toggle('task__button--done')
            btn.classList.toggle('task__button--do')
            this.#saveData()
        }
    }

    static #toggleDone = (id) => {
        const task = this.#list.find((item) => item.id === id);
        if (task) {
            task.done = !task.done;
            return task.done;
        } else {
            return null
        }
    }


    static #handleDelete = (data) => () => {

        if (confirm('Видалити задачу?')) {
            const result = this.#deleteById(data.id)
            if (result) {
                this.#render()
                this.#saveData()
            };

        }
    }

    static #deleteById = (id) => {
        this.#list = this.#list.filter((item) => item.id !== id);
        return true
    }
}

Todo.init();

window.todo = Todo;