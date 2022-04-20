<script>
export default {
    props: ['resourceName', 'field'],
}
</script>
<template>
    <span>{{ field.value }}</span>
</template>
