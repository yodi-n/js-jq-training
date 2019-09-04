import { TodoService } from './todo-service';
import { generateTodoTile } from './generate-todo-tile';
import { Todo } from './interfaces/todo';

export class AddModal {
  private selected: Todo | null = null;

  private todoList: JQuery<HTMLElement> = $('#new-todo-list');

  private $modal: any = $('#modal-add');

  constructor(private todoService:TodoService) {}

  open(): Promise<Todo> {
    return new Promise((resolve) => {
      this.$modal.on('hidden.bs.modal', () => {
        this.clear();
      });

      $('#modal-add-button').on('click', () => {
        if (this.selected === null) {
          throw new Error('No tile selected');
        }
        this.$modal.modal('hide');
        const owner = String($('#ownerInput').val());
        this.selected.owner = owner !== '' ? owner : null;
        const dueDate = String($('#dueDateInput').val());
        if (dueDate && dueDate !== '') {
          this.selected.dueDate = new Date(dueDate);
        }
        resolve(this.selected);
      });

      this.$modal.modal({
            backdrop: 'static'
          }
      );

      this.populate();
    });
  }

  populate(): void {
    this.todoService.findAll()
    .then(toDoList => {
      toDoList.data.forEach(todo => {
        const $tile = generateTodoTile(this.todoService)(todo);
        $tile.on('click', () => {
          this.todoList.find('.todo-tile').removeClass('selected');
          $tile.addClass('selected');
          this.selected = todo;
        });
        this.todoList.append($tile);
      });
    });
  }

  clear(): void {
    this.todoList.find('.todo-tile').remove();
    this.$modal.off('hidden.bs.modal');
    $('#ownerInput').val('');
    $('#dueDateInput').val('');
    $('#modal-add-button').off('click');
  }
}