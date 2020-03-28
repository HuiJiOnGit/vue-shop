export default {
    state: {
        // 对话框是否显示
        dialogFormVisible: false,
        // 对话框title
        dialogTitle: '',
        // 对话框密码form-item是否显示
        dialogFormPasswordItemVisible: true,
        // 用户id
        userId: null,
        // 用户名input是否可见
        UserDisabled: false
    },
    getters: {

    },
    mutations: {
        // 打开对话框
        AddUserDialog(state) {
            state.dialogFormVisible = true;
            state.dialogFormPasswordItemVisible = true;
            state.dialogTitle = "添加用户";
            state.UserDisabled = false;
        },
        // 编辑对话框
        EditUserDialog(state, id) {
            state.dialogFormVisible = true;
            state.dialogFormPasswordItemVisible = false;
            state.dialogTitle = "编辑用户";
            state.UserDisabled = true;
            state.userId = id;
            // console.log(id);
        },
        // 关闭事件
        CloseUserDialog(state,bool) {
            // console.log(bool);
            state.dialogFormVisible = bool;
            state.userId = null;
        }
    },
    actions: {

    }
}