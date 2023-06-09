import * as Yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack5";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { Form, FormikProvider, useFormik } from "formik";
// material
import { styled } from "@material-ui/core/styles";
import { LoadingButton } from "@material-ui/lab";
import {
  Card,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
} from "@material-ui/core";
// utils
import fakeRequest from "../../../utils/fakeRequest";
// routes
import { PATH_DASHBOARD } from "../../../routes/paths";
//
import { QuillEditor } from "../../editor";
import { UploadMultiFile } from "../../upload";
import {
  TextField,
  Select,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { AddProductAPI } from "../API/AddProductAPI";
import { GetAllCategory } from "../API/GetAllCategory";
import { useEffect } from "react";
import { useState } from "react";

// ----------------------------------------------------------------------

const GENDER_OPTION = ["Men", "Women", "Kids"];

const TAGS_OPTION = ["S", "M", "L", "XL"];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

// ----------------------------------------------------------------------

ArtProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ArtProductNewForm({ isEdit, currentProduct }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [category, setCategory] = useState([]);
  const [size, setSize] = useState([
    {
      quantity: 1,
      sizeName: "",
    },
  ]);
  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.array().min(1, "Images is required"),
    price: Yup.number().required("Price is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || "",
      description: currentProduct?.description || "",
      images: currentProduct?.images || [],
      code: currentProduct?.code || "",
      sku: currentProduct?.sku || "",
      price: currentProduct?.price || "",
      priceSale: currentProduct?.priceSale || "",
      inStock: Boolean(currentProduct?.inventoryType !== "out_of_stock"),
      categoryName: "",
      categoryId: 0,
      quantity: "",
      stockQuantity: "",
      size: [],
    },
    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        // resetForm();
        setSubmitting(false);
        await AddProductAPI(values);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    },
  });

  const {
    errors,
    values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        "images",
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFieldValue]
  );

  const handleRemoveAll = () => {
    setFieldValue("images", []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images.filter((_file) => _file !== file);
    setFieldValue("images", filteredItems);
  };

  useEffect(() => {
    GetAllCategory({ setCategory });
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...size];
    list[index][name] = value;
    setSize(list);
  };

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Product Name"
                  {...getFieldProps("name")}
                  error={Boolean(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />

                <div>
                  <LabelStyle>Description</LabelStyle>
                  <QuillEditor
                    simple
                    id="product-description"
                    value={values.description}
                    onChange={(val) => setFieldValue("description", val)}
                    error={Boolean(touched.description && errors.description)}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.description && errors.description}
                    </FormHelperText>
                  )}
                </div>

                <div>
                  <LabelStyle>Add Images</LabelStyle>
                  <UploadMultiFile
                    showPreview
                    maxSize={3145728}
                    accept="image/*"
                    files={values.images}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    onRemoveAll={handleRemoveAll}
                    error={Boolean(touched.images && errors.images)}
                  />
                  {touched.images && errors.images && (
                    <FormHelperText error sx={{ px: 2 }}>
                      {touched.images && errors.images}
                    </FormHelperText>
                  )}
                </div>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      {...getFieldProps("inStock")}
                      checked={values.inStock}
                    />
                  }
                  label="In stock"
                  sx={{ mb: 2 }}
                />

                <Stack spacing={3}>
                  {size.map((item, index) => {
                    return (
                      <>
                        <TextField
                          fullWidth
                          label="Size Quantity"
                          value={item.quantity}
                          onChange={(e) => handleChange(e, index)}
                        />
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            Size
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            // value={values.categoryName}
                            label="Size & Quantity"
                            value={item.sizeName}
                          >
                            {TAGS_OPTION.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item}>
                                  {item}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </>
                    );
                  })}
                  <TextField
                    fullWidth
                    label="Product Code"
                    {...getFieldProps("code")}
                  />
                  <TextField
                    fullWidth
                    label="Product SKU"
                    {...getFieldProps("sku")}
                  />
                  <TextField
                    fullWidth
                    label="Quantity"
                    {...getFieldProps("quantity")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">No.</InputAdornment>
                      ),
                      type: "number",
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Stock-Quantity"
                    {...getFieldProps("stockQuantity")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">No.</InputAdornment>
                      ),
                      type: "number",
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Category
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={values.categoryName}
                      label="Category"
                      onChange={(val) => {
                        setFieldValue(
                          "categoryName",
                          val.target.value.CategoryName
                        );
                        setFieldValue(
                          "categoryId",
                          val.target.value.CategoryID
                        );
                      }}
                    >
                      {category.map((item, index) => {
                        return (
                          <MenuItem key={item.CategoryId} value={item}>
                            {item.CategoryName}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Regular Price"
                    {...getFieldProps("price")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                      type: "number",
                    }}
                    error={Boolean(touched.price && errors.price)}
                    helperText={touched.price && errors.price}
                  />

                  <TextField
                    fullWidth
                    placeholder="0.00"
                    label="Sale Price"
                    {...getFieldProps("priceSale")}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₹</InputAdornment>
                      ),
                      type: "number",
                    }}
                  />
                </Stack>
              </Card>

              <LoadingButton
                type="submit"
                fullWidth
                variant="outlined"
                size="large"
                loading={isSubmitting}
              >
                {"Create Product"}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
