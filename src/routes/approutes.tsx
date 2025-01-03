import { Routes, Route } from "react-router-dom";
import Home from '../pages/home';
import Headers from '../components/meta/headers';
import { NotFound } from "../pages/not_found";
import ReportTable from "../pages/reports/report_table";
import CertificateTable from "../pages/certificates/certificates_table";
import QuotationTable from "../pages/quotation/quotation_table";
import Quotation from "../pages/quotation/new_quotation";
import Certificate from "../pages/certificates/new_certificates";
import ShipsTable from "../pages/ships/ship_list";
import NewShip from "../pages/ships/new_ship";

export const AppRoutes = () => {

    return (
        <Routes>
            <Route 
                path="/" 
                element={
                    <>
                    <Headers title='Home' description='Home Page'></Headers>
                    <Home />
                    </>
                } 
            />
            <Route 
                path="/home" 
                element={
                    <>
                    <Headers title='Home' description='Home Page'></Headers>
                    <Home />
                    </>
                } 
            />
            <Route 
                path="/quotation" 
                element={
                    <>
                    <Headers title='quotation' description='quotation'></Headers>
                    <QuotationTable />
                    </>
                } 
            />
            <Route 
                path="/quotation/form" 
                element={
                    <>
                    <Headers title='quotation' description='quotation'></Headers>
                    <Quotation />
                    </>
                } 
            />
            <Route 
                path="/reports" 
                element={
                    <>
                    <Headers title='reports' description='reports'></Headers>
                    <ReportTable />
                    </>
                } 
            />
            <Route 
                path="/certificates" 
                element={
                    <>
                    <Headers title='certificates' description='certificates'></Headers>
                    <CertificateTable />
                    </>
                } 
            />
            <Route 
                path="/ships" 
                element={
                    <>
                    <Headers title='ships' description='ships'></Headers>
                    <ShipsTable />
                    </>
                } 
            />
            <Route 
                path="/ships/new" 
                element={
                    <>
                    <Headers title='ships new' description='ships/new'></Headers>
                    <NewShip />
                    </>
                } 
            />
            <Route 
                path="/certificates/form" 
                element={
                    <>
                    <Headers title='certificates' description='certificates'></Headers>
                    <Certificate />
                    </>
                } 
            />
            <Route path="*" element={
                <>
                <Headers title='No Found' description='No Found'></Headers>
                <NotFound />
                </>
                }
            />
        </Routes>
    );
};
