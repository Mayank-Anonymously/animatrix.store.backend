import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { format } from "date-fns";
import { sentenceCase } from "change-case";
import { Icon } from "@iconify/react";
import { Link as RouterLink } from "react-router-dom";
import shareFill from "@iconify/icons-eva/share-fill";
import printerFill from "@iconify/icons-eva/printer-fill";
import downloadFill from "@iconify/icons-eva/download-fill";
import trash2Outline from "@iconify/icons-eva/trash-2-outline";
import moreVerticalFill from "@iconify/icons-eva/more-vertical-fill";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
// material
import { useTheme } from "@material-ui/core/styles";
import {
  Box,
  Card,
  Menu,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
} from "@material-ui/core";
// utils
import mockData from "../../../utils/mock-data";
//
import Label from "../../Label";
import Scrollbar from "../../Scrollbar";
import { MIconButton } from "../../@material-extend";

// ----------------------------------------------------------------------

// const MOCK_BOOKINGS = [...Array(5)].map((_, index) => ({
//   id: item.userid,
//   name: mockData.name.fullName(index),
//   avatar: mockData.image.avatar(index),
//   checkIn: mockData.time(index),
//   checkOut: mockData.time(index),
//   phoneNumber: mockData.phoneNumber(index),
//   status: (index === 1 && "pending") || (index === 3 && "un_paid") || "paid",
//   roomType: (index === 1 && "double") || (index === 3 && "king") || "single",
// }));

// ----------------------------------------------------------------------

MoreMenuButton.propTypes = {
  onDelete: PropTypes.func,
  onDownload: PropTypes.func,
  onPrint: PropTypes.func,
  onShare: PropTypes.func,
};
BookingDetails.propTypes = {
  walletdata: PropTypes.string,
};

function MoreMenuButton({ onDownload, onPrint, onShare, onDelete }) {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <>
        <MIconButton ref={menuRef} size="large" onClick={handleOpen}>
          <Icon icon={moreVerticalFill} width={20} height={20} />
        </MIconButton>
      </>

      <Menu
        open={open}
        anchorEl={menuRef.current}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 200, maxWidth: "100%" },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={onDownload}>
          <Icon icon={downloadFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Download
          </Typography>
        </MenuItem>
        <MenuItem onClick={onPrint}>
          <Icon icon={printerFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Print
          </Typography>
        </MenuItem>
        <MenuItem onClick={onShare}>
          <Icon icon={shareFill} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Share
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
          <Icon icon={trash2Outline} width={20} height={20} />
          <Typography variant="body2" sx={{ ml: 2 }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}

export default function BookingDetails({ walletdata }) {
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";
  // console.log(
  //   "walletdata:::",
  //   walletdata.map((item) => item.userid)
  // );
  const handleClickDownload = () => {};
  const handleClickPrint = () => {};
  const handleClickShare = () => {};
  const handleClickDelete = () => {};

  return (
    <>
      <Card>
        <CardHeader title="Booking Details" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 240 }}>userId</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>crearedAt</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>updatedAt</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Type</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>amount </TableCell>
                  {/* <TableCell sx={{ minWidth: 120 }}>Room Type</TableCell> */}
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {walletdata.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={row.userid} src={row.avatar} />
                        <Typography variant="subtitle2">
                          {row.userid}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {format(new Date(row.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(row.updatedAt), "dd MMM yyyy")}
                    </TableCell>

                    <TableCell>
                      <Label
                        variant={isLight ? "ghost" : "filled"}
                        color={
                          (row.type === "cr" && "success") ||
                          (row.type === "dr" && "success") ||
                          "error"
                        }
                      >
                        {sentenceCase(row.type)}
                      </Label>
                    </TableCell>

                    {/* <TableCell>{row.phoneNumber}</TableCell> */}
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.amount}
                    </TableCell>

                    <TableCell align="right">
                      <MoreMenuButton
                        onDownload={handleClickDownload}
                        onPrint={handleClickPrint}
                        onShare={handleClickShare}
                        onDelete={handleClickDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 2, textAlign: "right" }}>
          <Button
            to="#"
            size="small"
            color="inherit"
            component={RouterLink}
            endIcon={<Icon icon={arrowIosForwardFill} />}
          >
            View All
          </Button>
        </Box>
      </Card>
    </>
  );
}
