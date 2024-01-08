<template>
  <CContainer class="d-flex align-items-center min-vh-100">
    <CRow class="w-100 justify-content-center">
      <CCol md="10">
        <div class="w-100">
        <div class="clearfix">
          <h1 class="float-left display-3 mr-4">404</h1>
          <h1 class="pt-3">=( Ops! Página não encontrada.</h1>     
          <CLink to="/">
            Clique aqui para voltar a página principal
          </CLink>
        </div>
      </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script>
export default {
  name: 'Page404'
}
</script>
