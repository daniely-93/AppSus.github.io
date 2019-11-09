export default {
    props: ['unread'],
    template: `
    <div class="side-menu">
        <button class="button btn-compose" @click="toggleForm"><i class="fa fa-pencil-alt"></i> Compose</button>
        <ul class="side-menu-list">
            <li :class="{active : active === 'inbox' ,  bold : unread && active === 'inbox' }" class="side-menu-item" @click="onDirClick('inbox')"><i class="fa fa-inbox"></i> Inbox <span v-if="unread && active === 'inbox'">({{ unread }})</span></li>
            <li :class="{active : active === 'sent' ,  bold : unread && active === 'sent' }" class="side-menu-item" @click="onDirClick('sent')"><i class="fa fa-paper-plane"></i> Sent <span v-if="unread && active === 'sent'">({{ unread }})</span></li>
            <li :class="{active : active === 'starred' ,  bold : unread && active === 'starred' }" class="side-menu-item" @click="onDirClick('starred')"><i class="fa fa-star"></i > Starred <span v-if="unread && active === 'starred'">({{ unread }})</span></li>
            <li :class="{active : active === 'draft' ,  bold : unread && active === 'draft' }" class="side-menu-item" @click="onDirClick('drafts')"><i class="fa fa-sticky-note"></i> Drafts <span v-if="unread && active === 'drafts'">({{ unread }})</span></li>
            <li :class="{active : active === 'trash' ,  bold : unread && active === 'trash' }" class="side-menu-item" @click="onDirClick('trash')"><i class="fa fa-trash"></i> Trash <span v-if="unread && active === 'trash'">({{ unread }})</span></li>
        </ul>
    </div>`,
    data() {
        return {
            active: 'inbox'
        }
    },
    methods: {
        onDirClick(dir) {
            this.active = dir;
            this.$emit('clicked', dir)
        },
        toggleForm() {
            this.$emit('toggleForm');
        }
    },
}