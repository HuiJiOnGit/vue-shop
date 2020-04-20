export default function process(arr) {
    // 缓存用于记录
    const cache = [];
    for (const t of arr) {
        // 检查缓存中是否已经存在
        if (cache.find(c => c.attr_id === t.attr_id )) {
            // 已经存在说明以前记录过，现在这个就是多余的，直接忽略
            continue;
        }
        // 不存在就说明以前没遇到过，把它记录下来
        cache.push(t);
    }

    // 记录结果就是过滤后的结果
    return cache;
}