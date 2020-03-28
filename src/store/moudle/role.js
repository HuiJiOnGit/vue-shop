export default {
    state: {
        // 对话框是否显示
        dialogFormVisible: false,
        // 对话框title
        dialogTitle: '',
        // 角色id
        roleId: null,
    },
    getters: {

    },
    mutations: {
        // 打开对话框
        AddRoleDialog(state) {
            state.dialogFormVisible = true;
            state.dialogTitle = "添加角色";
        },
        // 编辑对话框
        EditRoleDialog(state, id) {
            state.dialogFormVisible = true;
            state.dialogTitle = "编辑角色";
            state.roleId = id;
            // console.log(id);
        },
        // 关闭事件
        CloseRoleDialog(state,bool) {
            // console.log(bool);
            state.dialogFormVisible = bool;
            state.roleId = null;
        }
    },
    actions: {

    }
}