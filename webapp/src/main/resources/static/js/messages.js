import {MessageRestPaginationService} from './rest/entities-rest-pagination.js'

let stompClient = null;
const channel_id = 2;//Захардкоденные переменные
const message_service = new MessageRestPaginationService();

function connect() {
    let socket = new SockJS('/websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/messages', function (message) {
            let result  = JSON.parse(message.body);
            // showMessage(result);
            if(result.user !== null) {
                showMessage(result);
            } else {
                showBotMessage(result)
            }

        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
}

window.sendName = function sendName(message) {
    stompClient.send("/app/message", {}, JSON.stringify({
        'inputMassage': message.content,
        'dateCreate': message.dateCreate,
        'user': message.user,
        'bot': message.bot
    }));
}

function showMessage(message) {
    const message_box = document.getElementById("all-messages");
    let messages_queue_context_user_container = document.createElement('div');
    messages_queue_context_user_container.className = "c-virtual_list__item";
    const time = message.dateCreate.split(' ')[1];
    messages_queue_context_user_container.innerHTML = `<div class="c-message--light" id="message_${message.id}_user_${message.user.id}_content">
                                                            <div class="c-message__gutter--feature_sonic_inputs">
                                                                <button class="c-message__avatar__button">
                                                                    <img class="c-avatar__image">
                                                                </button>                                                                
                                                            </div>
                                                        <div class="c-message__content--feature_sonic_inputs">
                                                            <div class="c-message__content_header" id="message_${message.id}_user_${message.user.id}_content_header">
                                                                <span class="c-message__sender">
                                                                    <a href="#modal_1" class="message__sender" id="user_${message.user.id}" data-user_id="${message.user.id}" data-toggle="modal">${message.user.name}</a>
                                                                </span>
                                                                <a class="c-timestamp--static">
                                                                    <span class="c-timestamp__label">
                                                                        ${time}
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <span class="c-message__body">
                                                                ${message.inputMassage}
                                                            </span>
                                                        </div>
                                                    </div>`;
    message_box.append(messages_queue_context_user_container);
    message_box.scrollTo(0, message_box.scrollHeight);
}
connect();

window.updateMessages = function updateMessages() {
    const message_box = document.getElementById("all-messages");
    message_box.innerHTML = "";


    const messages_promise = message_service.getAllMessagesByChannelId(channel_id);
    messages_promise.then(messages => { //После того как Месседжи будут получены, начнется выполнение этого блока
        messages.forEach(function (message, i) {

            if(message.user !== null) {
            let messages_queue_context_user_container = document.createElement('div');
            messages_queue_context_user_container.className = "c-virtual_list__item";
            const time = message.dateCreate.split(' ')[1];
            messages_queue_context_user_container.innerHTML = `<div class="c-message--light" id="message_${message.id}_user_${message.user.id}_content">
                                                        <div class="c-message__gutter--feature_sonic_inputs">
                                                            <button class="c-message__avatar__button">
                                                                <img class="c-avatar__image">
                                                            </button>
                                                        </div>
                                                        <div class="c-message__content--feature_sonic_inputs">
                                                            <div class="c-message__content_header" id="message_${message.id}_user_${message.user.id}_content_header">
                                                                <span class="c-message__sender">
                                                                    <a href="#modal_1" class="message__sender" id="user_${message.user.id}" data-user_id="${message.user.id}" data-toggle="modal">${message.user.name}</a>
                                                                </span>
                                                                <a class="c-timestamp--static">
                                                                    <span class="c-timestamp__label">
                                                                        ${time}
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <span class="c-message__body">
                                                                ${message.content}
                                                            </span>
                                                        </div>
                                                    </div>`;
            message_box.append(messages_queue_context_user_container);

            } else {
                let messages_queue_context_user_container = document.createElement('div');
                messages_queue_context_user_container.className = "c-virtual_list__item";
                const time = message.dateCreate.split(' ')[1];
                messages_queue_context_user_container.innerHTML = `<div class="c-message--light" id="message_${message.id}_user_${message.bot.id}_content">
                                                        <div class="c-message__gutter--feature_sonic_inputs">
                                                            <button class="c-message__avatar__button">
                                                                <img class="c-avatar__image">
                                                            </button>
                                                        </div>
                                                        <div class="c-message__content--feature_sonic_inputs">
                                                            <div class="c-message__content_header" id="message_${message.id}_user_${message.bot.id}_content_header">
                                                                <span class="c-message__sender">
                                                                    <a href="#modal_1" class="message__sender" id="user_${message.bot.id}" data-bot_id="${message.bot.id}" data-toggle="modal">${message.bot.nickName}</a>
                                                                </span>
                                                                <a class="c-timestamp--static">
                                                                    <span class="c-timestamp__label">
                                                                        ${time}
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <span class="c-message__body">
                                                                ${message.content}
                                                            </span>
                                                        </div>
                                                    </div>`;
                message_box.append(messages_queue_context_user_container);
            }
        });
    });
};

updateMessages();

function showBotMessage(message) {
    const message_box = document.getElementById("all-messages");
    let messages_queue_context_user_container = document.createElement('div');
    messages_queue_context_user_container.className = "c-virtual_list__item";
    const time = message.dateCreate.split(' ')[1];
    messages_queue_context_user_container.innerHTML = `<div class="c-message--light" id="message_${message.id}_user_${message.bot.id}_content">
                                                            <div class="c-message__gutter--feature_sonic_inputs">
                                                                <button class="c-message__avatar__button">
                                                                    <img class="c-avatar__image">
                                                                </button>                                                                
                                                            </div>
                                                        <div class="c-message__content--feature_sonic_inputs">
                                                            <div class="c-message__content_header" id="message_${message.id}_user_${message.bot.id}_content_header">
                                                                <span class="c-message__sender">
                                                                    <a href="#modal_1" class="message__sender" id="user_${message.user.id}" data-bot_id="${message.bot.id}" data-toggle="modal">${message.bot.name}</a>
                                                                </span>
                                                                <a class="c-timestamp--static">
                                                                    <span class="c-timestamp__label">
                                                                        ${time}
                                                                    </span>
                                                                </a>
                                                            </div>
                                                            <span class="c-message__body">
                                                                ${message.inputMassage}
                                                            </span>
                                                        </div>
                                                    </div>`;
    message_box.append(messages_queue_context_user_container);
    message_box.scrollTo(0, message_box.scrollHeight);
}

