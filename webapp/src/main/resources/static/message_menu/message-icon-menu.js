import {MessageRestPaginationService, UserRestPaginationService} from "../js/rest/entities-rest-pagination.js";
import {star_button_blank, star_button_filled} from "../js/messages.js";
import {open_right_panel, close_right_panel} from "../right_slide_panel/right_panel.js";

const user_service = new UserRestPaginationService();
const message_service = new MessageRestPaginationService();

$(document).on('click', '[id^=msg-icons-menu__starred_msg_]', function (e) {
    let msg_id = $(e.target).data('msg_id');
    getUserAndMessage(msg_id).then(user_and_msg => {
        let user = user_and_msg[0];
        let msg = user_and_msg[1];

        if (msg.user == null) {
            return;
        }

        let starredBy = msg["starredByWhom"];
        if (starredBy.find(usr => usr.id === user.id)) {
            starredBy.splice(starredBy.indexOf(user), 1);
            msg["starredByWhom"] = starredBy;
            message_service.update(msg).then(() => {
                $(`#msg-icons-menu__starred_msg_${msg_id}`).text(star_button_blank);
                $(`#message_${msg_id}_user_${msg.user.id}_starred`).remove();
            });
        } else {
            starredBy.push(user);
            msg["starredByWhom"] = starredBy;
            message_service.update(msg).then(() => {
                $(`#msg-icons-menu__starred_msg_${msg_id}`).text(star_button_filled);
                $(`#message_${msg_id}_user_${msg.user.id}_content`).prepend(
                    `<span id="message_${msg_id}_user_${msg.user.id}_starred" class="">`
                    + `${star_button_filled}&nbsp;<button id="to-starred-messages-link" type="button" class="btn btn-link">Added to your starred items.</button>`
                    + `</span>`);
            });
        }

        if (is_open) {
            populateRightPane();
        }
    });
});

const getUserAndMessage = async (id) => {
    const user = await user_service.getLoggedUser();
    const msg = await message_service.getById(id);
    return [user, msg];
};

// open right panel
let populateRightPane = () => {
    $('.p-flexpane__title_container').text('Starred Items');
    const target_el = $('.p-flexpane__inside_body-scrollbar__child');
    target_el.empty();
    user_service.getLoggedUser()
        .then((user) => {
            message_service.getStarredMessagesForUser(user.id)
                .then((messages) => {
                    if (messages.length !== 0) {
                        messages.forEach((message, i) => {
                            const time = message.dateCreate.split(' ')[1];
                            target_el.append(
                                `<div class="c-virtual_list__item right-panel-msg-menu">
                                        <div class="c-message--light" id="message_${message.id}_user_${message.user.id}_content">
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
                                                                    <span class="c-timestamp__label">
                                                                        ${message.dateCreate}
                                                                    </span>                                                                     
                                                                </a>
                                                            </div>
                                                            <span class="c-message__body">
                                                                ${message.content}
                                                            </span>
                                                        </div>
                                                        ${starred_message_menu(message)}
                                        </div>
                                    </div>`
                            );
                        });
                    } else {
                        target_el.append(`<div class="starred-messages-empty">
                                                <div>
                                                    <img class="starred-messages-empty_img" src="image/empty_starred_posts.png">
                                                </div>
                                                <div class="starred-messages-empty_content">
                                                    <h5>
                                                        No starred items
                                                    </h5>
                                                    <p>
                                                        Star a message or file to save it here. Mark your to-dos, or 
                                                        save something for later — only you can see your starred items, so use them however you like!
                                                    </p>
                                                </div>
                                          </div>`
                        );
                    }
                });
        });
};

let is_open;

$(document).on('load', () => is_open = false);

let toggle_right_menu = () => {
    if (is_open) {
        close_right_panel();
        is_open = false;
    } else {
        open_right_panel();
        populateRightPane();
        is_open = true;
    }
};

$('.p-classic_nav__right__star__button').on('click', () => {
    toggle_right_menu();
});

$(document).on('click', '#to-starred-messages-link', () => {
    toggle_right_menu();
});

// right panel msg menu
const back_to_msg = '&#8678;';
const starred_message_menu = (message) => {
    return `<div class="message-icons-menu-class" id="message-icons-menu">` +
        `<div class="btn-group" role="group" aria-label="Basic example">` +
        `<button type="button" class="btn btn-light">${back_to_msg}</button>` + // back
        `<button id="msg-icons-menu__starred_msg_${message.id}" data-msg_id="${message.id}" type="button" class="btn btn-light">${star_button_filled}</button>` + // star
        `</div>` +
        `</div>`;
};