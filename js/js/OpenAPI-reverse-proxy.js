// 定义目标URL
const TELEGRAPH_URL = 'https://api.openai.com';

// 定义允许的HTTP方法
const ALLOWED_METHODS = ['GET', 'POST'];

// 定义允许发起代理请求的来源域名列表
//注意，这里例子写的是我的博客链接，使用时请务必修改为你用于反代API的URL，当然你也可以删除本行限制
const ALLOWED_ORIGINS = ['https://www.wqzs.vip'];

// 为每个传入的请求添加事件监听器
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

// 异步处理请求的函数
async function handleRequest(request) {
  try {
    // 解析请求的URL
    const url = new URL(request.url);

    // 获取请求的HTTP方法，并将其转换为大写
    const method = request.method.toUpperCase();

    // 获取请求的来源域
    const origin = request.headers.get('Origin');

    // 检查请求的HTTP方法是否在允许的方法列表中
    if (!ALLOWED_METHODS.includes(method)) {
      // 如果不在允许的方法列表中，返回405状态码
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 检查请求的来源域是否在允许的来源域名列表中
    if (!ALLOWED_ORIGINS.includes(origin)) {
      // 如果不在允许的来源域名列表中，返回403状态码
      return new Response('Forbidden', { status: 403 });
    }

    // 修改请求的目标主机
    url.host = TELEGRAPH_URL.replace(/^https?:\/\//, '');

    // 创建一个新的请求对象，包含原始请求的所有信息
    const modifiedRequest = new Request(url.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.body,
      redirect: 'follow'
    });

    // 发送修改后的请求
    const response = await fetch(modifiedRequest);

    // 用响应内容创建一个新的响应对象
    const modifiedResponse = new Response(response.body, response);

    // 为响应对象设置允许跨域访问的响应头
    modifiedResponse.headers.set('Access-Control-Allow-Origin', origin);

    // 返回修改后的响应
    return modifiedResponse;
  } catch (error) {
    // 如果在处理过程中发生错误，返回500状态码
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
