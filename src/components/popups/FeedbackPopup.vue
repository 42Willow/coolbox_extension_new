<script setup lang="ts">
import Shadow from "~/components/other/Shadow.vue";
import {Ref, ref} from "vue";
import {apiSend} from "~/utils/apiUtils";
import PopupBase from "~/components/popups/PopupBase.vue";

const popup: Ref<InstanceType<typeof PopupBase>> = ref(null);
const feedbackBody = ref("");
const isAnonymous = ref(false);
const sendDisabled = ref(false);

function sendFeedback() {
    sendDisabled.value = true;
    popup.value.closePopup();
    apiSend("POST", "feedback", {
        content: feedbackBody.value,
        origin: "schoolbox",
        // origin: "test",
        anonymous: isAnonymous.value
    }, "Feedback Sent!", "Failed to send feedback - you may be banned or not have internet.")
}

function openPopup() {
    popup.value.openPopup();
    sendDisabled.value = false;
    feedbackBody.value = "";
}

defineExpose({openPopup});
</script>

<template>
    <PopupBase title="Submit Feedback" ref="popup">
        Submit your feedback, comments, suggestions, or bug reports here.
        <textarea class="resize-none h-40 mt-2" v-model="feedbackBody"></textarea>
        <Shadow>
            <label for="anon" class="align-top">Anonymous:</label>
            <input type="checkbox" class="dui-checkbox dui-checkbox-sm" id="anon" v-model="isAnonymous">
        </Shadow>
        <span class="text-gray-500 italic text-xs mb-2 block">
            This feedback is publicly visible, with your name, unless you tick the anonymous box.<br>
            (Do not tick it if you expect a response!)<br>
            Abuse will result in a non-appealable ban.
        </span>
        <template #buttons>
            <button class="button-l">Cancel</button>
            <button class="button-r submit" @click="sendFeedback" :disabled="sendDisabled">Send Feedback</button>
        </template>
    </PopupBase>
</template>