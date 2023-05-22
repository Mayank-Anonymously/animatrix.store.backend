import { useEffect } from "react";
import { paramCase } from "change-case";
import { useParams, useLocation } from "react-router-dom";
// material
import { Container } from "@material-ui/core";
// redux
import { useDispatch, useSelector } from "../../../redux/store";
import { getProducts } from "../../../redux/slices/product";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
// hooks
import useSettings from "../../../hooks/useSettings";
// components
import Page from "../../../components/Page";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import ArtProductNewForm from "../../../components/_dashboardone/e-commerce/ArtProductNewForm";
// ----------------------------------------------------------------------

export default function EcommerceProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  const { products } = useSelector((state) => state.product);
  const isEdit = pathname.includes("edit");
  const currentProduct = products.find(
    (product) => paramCase(product.name) === name
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  return (
    <Page title="Ecommerce: Create a new product | Asfiya_Art_Shop">
      <Container maxWidth={themeStretch ? false : "lg"}>
        <HeaderBreadcrumbs
          heading={!isEdit ? "Create a new product" : "Edit product"}
          links={[
            { name: "Dashboard", href: PATH_DASHBOARD.root },
            {
              name: "E-Commerce",
              href: PATH_DASHBOARD.eCommerce.root,
            },
            { name: !isEdit ? "New product" : name },
          ]}
        />

        <ArtProductNewForm isEdit={isEdit} currentProduct={currentProduct} />
      </Container>
    </Page>
  );
}